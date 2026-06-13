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
    this.processCtx = this.processCanvas.getContext('2d');

    this.state = 'idle';
    this.trajectory = [];
    this.prevFrameData = null;
    this.kalman = null;
    this._rafHandle = null;
    this._stopTimer = null;

    this.config = {
      ballColor: 'white',
      processScale: 0.3,
      minBlobPx: 8,
      maxBlobPx: 3000,
      motionThreshold: 20,
      trackTimeout: 6000,
      minPoints: 5,
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

  startTracking() {
    this.state = 'tracking';
    this.trajectory = [];
    this.prevFrameData = null;
    this.kalman = null;
    this._clearTrajectoryCanvas();

    if (this._stopTimer) clearTimeout(this._stopTimer);
    this._stopTimer = setTimeout(
      () => this.state === 'tracking' && this._finalize(true),
      this.config.trackTimeout
    );

    this.dispatchEvent(new CustomEvent('trackingStarted'));
  }

  stopTracking(auto = false) {
    if (this._stopTimer) {
      clearTimeout(this._stopTimer);
      this._stopTimer = null;
    }
    this._finalize(auto);
  }

  reset() {
    if (this._stopTimer) clearTimeout(this._stopTimer);
    this._stopTimer = null;
    this.state = 'ready';
    this.trajectory = [];
    this.kalman = null;
    this.prevFrameData = null;
    this._clearTrajectoryCanvas();
    this._clearOverlayCanvas();
  }

  getTrajectory() {
    return [...this.trajectory];
  }

  /* ── Internal loop ── */

  _loop(ts) {
    this._rafHandle = requestAnimationFrame(this._loop);
    if (this.video.readyState < 2) return;
    this._syncDimensions();
    if (this.state === 'tracking') this._detectAndTrack(ts);
  }

  _syncDimensions() {
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    if (this.overlayCanvas.width !== vw) {
      this.overlayCanvas.width = vw;
      this.overlayCanvas.height = vh;
      this.trajectoryCanvas.width = vw;
      this.trajectoryCanvas.height = vh;
    }
  }

  _detectAndTrack(ts) {
    const { processScale } = this.config;
    const pw = Math.floor(this.video.videoWidth * processScale);
    const ph = Math.floor(this.video.videoHeight * processScale);

    this.processCanvas.width = pw;
    this.processCanvas.height = ph;
    this.processCtx.drawImage(this.video, 0, 0, pw, ph);
    const frame = this.processCtx.getImageData(0, 0, pw, ph);

    const hit = this.prevFrameData
      ? this._detectMotionColor(frame, this.prevFrameData, pw, ph)
      : this._detectColor(frame, pw, ph);

    this.prevFrameData = frame;

    if (!hit) return;

    const fx = hit.x / processScale;
    const fy = hit.y / processScale;
    const { x, y } = this._kalman(fx, fy);

    this.trajectory.push({ x, y, t: ts, confidence: hit.confidence });
    this._drawPoint(x, y);

    // Auto-stop when ball slows or exits frame
    if (this.trajectory.length > 12) {
      const tail = this.trajectory.slice(-6);
      if (this._avgVelocity(tail) < 3) {
        this._finalize(true);
        return;
      }
    }
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    if (x < -20 || x > vw + 20 || y < -20 || y > vh + 20) {
      this._finalize(true);
    }
  }

  /* ── Detection methods ── */

  _detectMotionColor(curr, prev, w, h) {
    const cd = curr.data;
    const pd = prev.data;
    let sx = 0, sy = 0, n = 0;

    for (let i = 0; i < w * h; i++) {
      const p = i * 4;
      const motion =
        (Math.abs(cd[p] - pd[p]) +
          Math.abs(cd[p + 1] - pd[p + 1]) +
          Math.abs(cd[p + 2] - pd[p + 2])) /
        3;
      if (motion > this.config.motionThreshold) {
        const x = i % w;
        const y = Math.floor(i / w);
        if (this.isTargetColor(cd[p], cd[p + 1], cd[p + 2])) {
          sx += x; sy += y; n++;
        }
      }
    }

    if (n < this.config.minBlobPx || n > this.config.maxBlobPx) return null;
    return { x: sx / n, y: sy / n, confidence: Math.min(1, n / 80) };
  }

  _detectColor(frame, w, h) {
    const d = frame.data;
    let sx = 0, sy = 0, n = 0;

    for (let i = 0; i < w * h; i++) {
      const p = i * 4;
      if (this.isTargetColor(d[p], d[p + 1], d[p + 2])) {
        sx += i % w; sy += Math.floor(i / w); n++;
      }
    }

    if (n < this.config.minBlobPx || n > this.config.maxBlobPx) return null;
    return { x: sx / n, y: sy / n, confidence: 0.5 };
  }

  isTargetColor(r, g, b) {
    switch (this.config.ballColor) {
      case 'white': {
        const brightness = (r + g + b) / 3;
        const sat = Math.max(r, g, b) - Math.min(r, g, b);
        return brightness > 195 && sat < 48;
      }
      case 'yellow':
        return r > 200 && g > 200 && b < 100;
      case 'orange':
        return r > 210 && g > 100 && g < 185 && b < 80;
      default:
        return false;
    }
  }

  /* ── Kalman filter ── */

  _kalman(mx, my) {
    if (!this.kalman) {
      this.kalman = { x: mx, y: my, vx: 0, vy: 0, px: 10, py: 10 };
      return { x: mx, y: my };
    }
    const Q = 1.5, R = 15;
    const k = this.kalman;

    const predX = k.x + k.vx, predY = k.y + k.vy;
    const ppx = k.px + Q, ppy = k.py + Q;
    const Kx = ppx / (ppx + R), Ky = ppy / (ppy + R);

    const nx = predX + Kx * (mx - predX);
    const ny = predY + Ky * (my - predY);
    k.vx = nx - k.x; k.vy = ny - k.y;
    k.x = nx; k.y = ny;
    k.px = (1 - Kx) * ppx; k.py = (1 - Ky) * ppy;
    return { x: nx, y: ny };
  }

  /* ── Helpers ── */

  _avgVelocity(pts) {
    if (pts.length < 2) return Infinity;
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy = pts[i].y - pts[i - 1].y;
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total / (pts.length - 1);
  }

  _finalize(auto) {
    if (this._stopTimer) { clearTimeout(this._stopTimer); this._stopTimer = null; }

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

    // Smooth curve
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

    // Peak marker
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

    // Distance ground line
    ctx.save();
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    ctx.lineTo(trail[trail.length - 1].x, trail[0].y);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Start dot (green)
    this._dot(ctx, trail[0].x, trail[0].y, '#00ff88', 9);
    // Peak dot (yellow)
    this._dot(ctx, peak.x, peak.y, '#ffff00', 7, '#000', 1.5);
    // End dot (red)
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
