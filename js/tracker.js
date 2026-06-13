/* Ball tracker — motion + color detection with Kalman smoothing */

class BallTracker extends EventTarget {
  constructor(video, overlayCanvas, trajectoryCanvas) {
    super();
    this.video = video;
    this.overlayCanvas = overlayCanvas;
    this.overlayCtx = overlayCanvas.getContext('2d');
    this.trajectoryCanvas = trajectoryCanvas;
    this.trajectoryCtx = trajectoryCanvas.getContext('2d');

    this.processCanvas = document.createElement('canvas');
    // willReadFrequently: critical perf hint — browser keeps pixels in CPU mem
    this.processCtx = this.processCanvas.getContext('2d', { willReadFrequently: true });

    this.state = 'idle';
    this.trajectory = [];
    this.prevFrameData = null;
    this.kalman = null;
    this._rafHandle = null;
    this._stopTimer = null;
    this._lostFrames = 0;       // consecutive frames with no detection during tracking
    this._watchPos = null;
    this._watchVelBuf = [];     // last N velocity vectors for shot confirmation
    this._processDims = { w: 0, h: 0 };  // cached process canvas dims

    this.config = {
      ballColor: 'white',
      // Slightly larger scale during tracking for accuracy; watching uses smaller (see _getScale)
      processScale: 0.32,
      watchScale: 0.24,
      minBlobPx: 6,
      maxBlobPx: 2200,
      motionThreshold: 18,
      trackTimeout: 6000,
      minPoints: 5,
      // Shot detection
      shotTriggerVelocity: 38,    // px/frame at full video res
      shotConfirmFrames: 2,       // consecutive fast frames required before triggering
      shotDirDotMin: 0.45,        // min cosine similarity between consecutive velocity vectors
      // Auto-stop
      maxLostFrames: 7,           // finalize if ball missing this many frames in a row
      slowVelThresh: 3,           // px/frame — consider stopped
      slowVelWindow: 6,           // trailing frames to average for slow-stop check
      slowVelMinPts: 14,          // don't check slowness before this many trajectory points
    };

    this._loop = this._loop.bind(this);
  }

  setConfig(patch) {
    Object.assign(this.config, patch);
  }

  /* ── Public control ── */

  startLoop() {
    if (!this._rafHandle) {
      this._rafHandle = requestAnimationFrame(this._loop);
    }
  }

  stopLoop() {
    if (this._rafHandle) {
      cancelAnimationFrame(this._rafHandle);
      this._rafHandle = null;
    }
  }

  startWatching() {
    this._clearStopTimer();
    this.state = 'watching';
    this.trajectory = [];
    this.prevFrameData = null;
    this.kalman = null;
    this._watchPos = null;
    this._watchVelBuf = [];
    this._lostFrames = 0;
    this._clearTrajectoryCanvas();
    this.dispatchEvent(new CustomEvent('watching'));
  }

  startTracking() {
    this._clearStopTimer();
    this.state = 'tracking';
    this.trajectory = [];
    this.prevFrameData = null;
    this.kalman = null;
    this._lostFrames = 0;
    this._clearTrajectoryCanvas();

    this._stopTimer = setTimeout(
      () => this.state === 'tracking' && this._finalize(true),
      this.config.trackTimeout
    );

    this.dispatchEvent(new CustomEvent('trackingStarted'));
  }

  stopTracking(auto = false) {
    this._clearStopTimer();
    this._finalize(auto);
  }

  reset(toWatching = false) {
    this._clearStopTimer();
    this.trajectory = [];
    this.kalman = null;
    this.prevFrameData = null;
    this._watchPos = null;
    this._watchVelBuf = [];
    this._lostFrames = 0;
    this._clearTrajectoryCanvas();
    this._clearOverlayCanvas();
    if (toWatching) {
      this.startWatching();
    } else {
      this.state = 'ready';
    }
  }

  getTrajectory() {
    return [...this.trajectory];
  }

  _clearStopTimer() {
    if (this._stopTimer) { clearTimeout(this._stopTimer); this._stopTimer = null; }
  }

  /* ── Internal loop ── */

  _loop(ts) {
    this._rafHandle = requestAnimationFrame(this._loop);
    if (this.video.readyState < 2) return;
    this._syncDimensions();
    if (this.state === 'tracking') this._detectAndTrack(ts);
    else if (this.state === 'watching') this._watchForShot(ts);
  }

  /* ── Frame helpers ── */

  _getScale(mode) {
    return mode === 'watch' ? this.config.watchScale : this.config.processScale;
  }

  _captureFrame(scale) {
    const pw = Math.floor(this.video.videoWidth  * scale);
    const ph = Math.floor(this.video.videoHeight * scale);
    // Only resize the off-screen canvas when dimensions actually change
    if (pw !== this._processDims.w || ph !== this._processDims.h) {
      this.processCanvas.width  = pw;
      this.processCanvas.height = ph;
      this._processDims = { w: pw, h: ph };
    }
    this.processCtx.drawImage(this.video, 0, 0, pw, ph);
    return { data: this.processCtx.getImageData(0, 0, pw, ph), w: pw, h: ph };
  }

  /* ── Auto shot detection ── */

  _watchForShot(ts) {
    const scale = this._getScale('watch');
    const { data: frame, w: pw, h: ph } = this._captureFrame(scale);

    const hit = this.prevFrameData
      ? this._detectMotionColor(frame, this.prevFrameData, pw, ph)
      : null;

    this.prevFrameData = frame;
    if (!hit) {
      this._watchVelBuf = [];   // reset confirmation buffer on detection gap
      return;
    }

    const fx = hit.x / scale;
    const fy = hit.y / scale;

    if (this._watchPos) {
      const dx = fx - this._watchPos.x;
      const dy = fy - this._watchPos.y;
      const vel = Math.hypot(dx, dy);

      if (vel > this.config.shotTriggerVelocity) {
        this._watchVelBuf.push({ dx, dy, vel });
      } else {
        this._watchVelBuf = [];
      }

      // Require N consecutive fast frames moving in a consistent direction
      if (this._watchVelBuf.length >= this.config.shotConfirmFrames) {
        const buf = this._watchVelBuf;
        const last = buf[buf.length - 1];
        const prev = buf[buf.length - 2];
        const dot = (last.dx * prev.dx + last.dy * prev.dy) /
                    (last.vel * prev.vel + 1e-9);

        if (dot >= this.config.shotDirDotMin) {
          this._watchVelBuf = [];
          this._watchPos = { x: fx, y: fy };
          this.dispatchEvent(new CustomEvent('shotDetected'));
          this.startTracking();
          // Seed first trajectory point so tracking starts warm
          const { x, y } = this._kalman(fx, fy);
          this.trajectory.push({ x, y, t: ts, confidence: hit.confidence });
          this._drawPoint(x, y);
          return;
        }
      }
    }

    this._watchPos = { x: fx, y: fy };
  }

  _syncDimensions() {
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    if (this.overlayCanvas.width !== vw) {
      this.overlayCanvas.width  = vw;
      this.overlayCanvas.height = vh;
      this.trajectoryCanvas.width  = vw;
      this.trajectoryCanvas.height = vh;
    }
  }

  _detectAndTrack(ts) {
    const scale = this._getScale('track');
    const { data: frame, w: pw, h: ph } = this._captureFrame(scale);

    const hit = this.prevFrameData
      ? this._detectMotionColor(frame, this.prevFrameData, pw, ph)
      : this._detectColor(frame, pw, ph);

    this.prevFrameData = frame;

    if (!hit) {
      this._lostFrames++;
      if (this._lostFrames >= this.config.maxLostFrames) {
        this._finalize(true);
      }
      return;
    }
    this._lostFrames = 0;

    const fx = hit.x / scale;
    const fy = hit.y / scale;
    const { x, y } = this._kalman(fx, fy);

    this.trajectory.push({ x, y, t: ts, confidence: hit.confidence });
    this._drawPoint(x, y);

    // Auto-stop: ball has slowed to a near-stop
    if (this.trajectory.length > this.config.slowVelMinPts) {
      const tail = this.trajectory.slice(-this.config.slowVelWindow);
      if (this._avgVelocity(tail) < this.config.slowVelThresh) {
        this._finalize(true);
        return;
      }
    }

    // Auto-stop: ball has exited frame
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    if (x < -30 || x > vw + 30 || y < -30 || y > vh + 30) {
      this._finalize(true);
    }
  }

  /* ── Detection methods ── */

  _detectMotionColor(curr, prev, w, h) {
    const cd = curr.data;
    const pd = prev.data;
    let sx = 0, sy = 0, n = 0;
    let minX = w, maxX = 0, minY = h, maxY = 0;

    for (let i = 0; i < w * h; i++) {
      const p = i * 4;
      // Average channel diff as motion magnitude
      const motion =
        (Math.abs(cd[p]     - pd[p])     +
         Math.abs(cd[p + 1] - pd[p + 1]) +
         Math.abs(cd[p + 2] - pd[p + 2])) / 3;

      if (motion > this.config.motionThreshold &&
          this.isTargetColor(cd[p], cd[p + 1], cd[p + 2])) {
        const x = i % w;
        const y = (i / w) | 0;
        sx += x; sy += y; n++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    if (n < this.config.minBlobPx || n > this.config.maxBlobPx) return null;

    // Reject blobs that are too elongated to be a roughly spherical ball
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    if (Math.max(bw, bh) / Math.max(Math.min(bw, bh), 1) > 5) return null;

    return { x: sx / n, y: sy / n, confidence: Math.min(1, n / 60) };
  }

  _detectColor(frame, w, h) {
    const d = frame.data;
    let sx = 0, sy = 0, n = 0;

    for (let i = 0; i < w * h; i++) {
      const p = i * 4;
      if (this.isTargetColor(d[p], d[p + 1], d[p + 2])) {
        sx += i % w; sy += (i / w) | 0; n++;
      }
    }

    if (n < this.config.minBlobPx || n > this.config.maxBlobPx) return null;
    return { x: sx / n, y: sy / n, confidence: 0.5 };
  }

  isTargetColor(r, g, b) {
    switch (this.config.ballColor) {
      case 'white': {
        // HSV-based: high value, low chroma
        const v = Math.max(r, g, b);
        const chroma = v - Math.min(r, g, b);
        // Must be bright and nearly achromatic
        return v > 200 && chroma < 40 && (r + g + b) > 610;
      }
      case 'yellow': {
        // Bright yellow: high R and G, low B, warm hue
        const warm = r > b + 100 && g > b + 100;
        return r > 185 && g > 185 && b < 90 && warm;
      }
      case 'orange': {
        // Orange: high R, moderate G, very low B
        return r > 195 && g > 75 && g < 175 && b < 75 && r > g * 1.2;
      }
      default:
        return false;
    }
  }

  /* ── Kalman filter (1-D per axis, constant-velocity model) ── */

  _kalman(mx, my) {
    if (!this.kalman) {
      this.kalman = { x: mx, y: my, vx: 0, vy: 0, px: 8, py: 8 };
      return { x: mx, y: my };
    }
    // Q: process noise — how much can velocity change per frame?
    //    Small Q = trusts smooth trajectory; too small = sluggish on turns
    // R: measurement noise — pixel centroid uncertainty after inverse-scale
    const Q = 0.9, R = 12;
    const k = this.kalman;

    const predX = k.x + k.vx;
    const predY = k.y + k.vy;
    const ppx = k.px + Q;
    const ppy = k.py + Q;
    const Kx = ppx / (ppx + R);
    const Ky = ppy / (ppy + R);

    const nx = predX + Kx * (mx - predX);
    const ny = predY + Ky * (my - predY);
    k.vx = nx - k.x;
    k.vy = ny - k.y;
    k.x = nx; k.y = ny;
    k.px = (1 - Kx) * ppx;
    k.py = (1 - Ky) * ppy;
    return { x: nx, y: ny };
  }

  /* ── Helpers ── */

  _avgVelocity(pts) {
    if (pts.length < 2) return Infinity;
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    }
    return total / (pts.length - 1);
  }

  _finalize(auto) {
    this._clearStopTimer();

    if (this.trajectory.length >= this.config.minPoints) {
      this.state = 'reviewing';
      this.drawFinalTrajectory();
      this.dispatchEvent(
        new CustomEvent('shotComplete', {
          detail: { trajectory: [...this.trajectory], auto },
        })
      );
    } else {
      this.state = 'ready';
      this._clearTrajectoryCanvas();
      this.dispatchEvent(
        new CustomEvent('trackingCancelled', {
          detail: { reason: 'insufficient_data' },
        })
      );
    }
  }

  /* ── Drawing ── */

  _drawPoint(x, y) {
    const ctx = this.trajectoryCtx;
    const trail = this.trajectory;
    if (trail.length > 1) {
      const prev = trail[trail.length - 2];
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(0,210,255,0.85)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,230,0,0.9)';
    ctx.fill();
  }

  drawFinalTrajectory(traj) {
    const trail = traj || this.trajectory;
    const ctx = this.trajectoryCtx;
    this._clearTrajectoryCanvas();
    if (trail.length < 2) return;

    // Smooth curve through midpoints (Chaikin-style)
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 0; i < trail.length - 1; i++) {
      const mx = (trail[i].x + trail[i + 1].x) / 2;
      const my = (trail[i].y + trail[i + 1].y) / 2;
      ctx.quadraticCurveTo(trail[i].x, trail[i].y, mx, my);
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);

    const grad = ctx.createLinearGradient(
      trail[0].x, trail[0].y,
      trail[trail.length - 1].x, trail[trail.length - 1].y
    );
    grad.addColorStop(0, '#00d2ff');
    grad.addColorStop(0.5, '#7fff7f');
    grad.addColorStop(1, '#ffd200');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(0,210,255,0.6)';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Peak marker (lowest y value = highest point)
    let peak = trail[0];
    for (const pt of trail) if (pt.y < peak.y) peak = pt;

    // Dashed height line
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(peak.x, peak.y);
    ctx.lineTo(peak.x, trail[0].y);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Dashed ground distance line
    ctx.save();
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    ctx.lineTo(trail[trail.length - 1].x, trail[0].y);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    this._dot(ctx, trail[0].x, trail[0].y, '#00ff88', 9);
    this._dot(ctx, peak.x, peak.y, '#ffff00', 7, '#000', 1.5);
    this._dot(ctx, trail[trail.length - 1].x, trail[trail.length - 1].y, '#ff4444', 9);
  }

  _dot(ctx, x, y, fill, r, stroke, sw) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = sw || 2;
      ctx.stroke();
    }
  }

  _clearTrajectoryCanvas() {
    this.trajectoryCtx.clearRect(
      0, 0,
      this.trajectoryCanvas.width,
      this.trajectoryCanvas.height
    );
  }

  _clearOverlayCanvas() {
    this.overlayCtx.clearRect(
      0, 0,
      this.overlayCanvas.width,
      this.overlayCanvas.height
    );
  }
}
