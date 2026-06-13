/* Main application controller */

class GolfTrackerApp {
  constructor() {
    this.storage = new ShotStorage();
    this.physics = new ShotPhysics();
    this.stream = null;
    this.sessionShots = 0;
    this.calibration = null;
    this.settings = this.storage.getSettings();
    this.currentStats = null;

    // FPS counter state
    this._fpsFrames = 0;
    this._fpsLast = performance.now();
    this._fpsValue = 0;
    this._metricsInterval = null;

    this._el = {};
    this._grabElements();
    this._buildTracker();
    this._bindEvents();
    this._applySettings();
    this._startCamera();
    this._updateSessionLabel();
  }

  /* ── Init ── */

  _grabElements() {
    const ids = [
      'video', 'overlay-canvas', 'trajectory-canvas',
      'btn-track', 'btn-track-icon', 'btn-track-label',
      'btn-history', 'btn-settings', 'btn-demo',
      'session-label', 'shot-counter',
      'tracking-status',
      'stats-panel', 'stat-carry', 'stat-height', 'stat-angle', 'stat-speed',
      'history-panel', 'history-list', 'close-history',
      'settings-panel', 'close-settings',
      'sel-ball-color', 'inp-known-dist', 'sel-camera',
      'btn-clear', 'btn-export',
      'toast-container',
      // metrics
      'metrics-live-dot',
      'm-label', 'm-res', 'm-fps', 'm-facing',
      'm-zoom', 'm-torch', 'm-focus', 'm-expo', 'm-cap-fps',
    ];
    ids.forEach((id) => {
      this._el[id] = document.getElementById(id);
    });
  }

  _buildTracker() {
    this.tracker = new BallTracker(
      this._el['video'],
      this._el['overlay-canvas'],
      this._el['trajectory-canvas']
    );
    this.tracker.setConfig({ ballColor: this.settings.ballColor });

    this.tracker.addEventListener('trackingStarted', () => {
      this._el['stats-panel'].classList.add('hidden');
      this._setTrackingStatus('● TRACKING…', true);
    });

    this.tracker.addEventListener('shotComplete', (e) => {
      this._onShotComplete(e.detail.trajectory);
    });

    this.tracker.addEventListener('trackingCancelled', () => {
      this._setTrackingStatus('');
      this._setState('ready');
      this._toast('Ball not detected – try again', 'warn');
    });
  }

  _bindEvents() {
    this._el['btn-track'].addEventListener('click', () => this._handleTrackBtn());
    this._el['btn-demo'].addEventListener('click', () => this._runDemo());
    this._el['btn-history'].addEventListener('click', () => this._openPanel('history'));
    this._el['btn-settings'].addEventListener('click', () => this._openPanel('settings'));
    this._el['close-history'].addEventListener('click', () => this._closePanel('history'));
    this._el['close-settings'].addEventListener('click', () => this._closePanel('settings'));

    this._el['sel-ball-color'].addEventListener('change', (e) => {
      this.settings.ballColor = e.target.value;
      this.tracker.setConfig({ ballColor: e.target.value });
      this.storage.saveSettings(this.settings);
    });
    this._el['inp-known-dist'].addEventListener('change', (e) => {
      this.settings.knownDistance = parseInt(e.target.value) || 150;
      this.storage.saveSettings(this.settings);
    });
    this._el['sel-camera'].addEventListener('change', (e) => {
      this.settings.cameraId = e.target.value;
      this.storage.saveSettings(this.settings);
      this._switchCamera(e.target.value);
    });
    this._el['btn-clear'].addEventListener('click', () => {
      if (confirm('Delete all shot history?')) {
        this.storage.clearAll();
        this._renderHistory();
        this._toast('History cleared');
      }
    });
    this._el['btn-export'].addEventListener('click', () => this._exportData());

    // Close panels on backdrop click
    ['history-panel', 'settings-panel'].forEach((id) => {
      this._el[id].addEventListener('click', (e) => {
        if (e.target === this._el[id]) this._closePanel(id.replace('-panel', ''));
      });
    });

    this._el['video'].addEventListener('loadedmetadata', () => this._syncCanvases());
    window.addEventListener('resize', () => this._syncCanvases());
  }

  _applySettings() {
    this._el['sel-ball-color'].value = this.settings.ballColor;
    this._el['inp-known-dist'].value = this.settings.knownDistance;
  }

  /* ── Camera ── */

  async _startCamera() {
    try {
      // iPhone 16: rear main wide (48MP f/1.6) is selected by requesting
      // high resolution + environment facing — iOS picks the best sensor.
      // Requesting 4K forces the main sensor over ultra-wide on iOS.
      const constraints = {
        video: {
          facingMode: { exact: 'environment' },
          width:     { ideal: 3840, min: 1280 },
          height:    { ideal: 2160, min: 720 },
          frameRate: { ideal: 60,   min: 30 },
        },
      };
      if (this.settings.cameraId) {
        delete constraints.video.facingMode;
        constraints.video.deviceId = { exact: this.settings.cameraId };
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this._el['video'].srcObject = this.stream;
      await this._el['video'].play();

      this.tracker.startLoop();
      this._setState('ready');
      await this._populateCameras();
      this._startMetrics();
    } catch (err) {
      this._showCameraError(err);
    }
  }

  async _populateCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === 'videoinput');
      const sel = this._el['sel-camera'];
      sel.innerHTML = '';
      cams.forEach((d, i) => {
        const opt = document.createElement('option');
        opt.value = d.deviceId;
        opt.textContent = d.label || `Camera ${i + 1}`;
        if (d.deviceId === this.settings.cameraId) opt.selected = true;
        sel.appendChild(opt);
      });
    } catch {
      /* permissions not yet granted for labels – fine */
    }
  }

  async _switchCamera(deviceId) {
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      });
      this._el['video'].srcObject = this.stream;
      await this._el['video'].play();
      this._startMetrics();
    } catch (err) {
      this._toast('Could not switch camera', 'error');
    }
  }

  _syncCanvases() {
    const vw = this._el['video'].videoWidth || this._el['video'].clientWidth;
    const vh = this._el['video'].videoHeight || this._el['video'].clientHeight;
    ['overlay-canvas', 'trajectory-canvas'].forEach((id) => {
      this._el[id].width = vw;
      this._el[id].height = vh;
    });
  }

  /* ── Track button state machine ── */

  _handleTrackBtn() {
    switch (this._state) {
      case 'ready': this._startTracking(); break;
      case 'tracking': this.tracker.stopTracking(false); break;
      case 'reviewing': this._resetShot(); break;
    }
  }

  _setState(state) {
    this._state = state;
    document.body.dataset.state = state;

    const iconEl = this._el['btn-track-icon'];
    const labelEl = this._el['btn-track-label'];
    const btn = this._el['btn-track'];

    const map = {
      idle:      { icon: '📷', label: 'START',     cls: '' },
      ready:     { icon: '●',  label: 'TRACK',     cls: 'ready' },
      tracking:  { icon: '■',  label: 'STOP',      cls: 'active' },
      reviewing: { icon: '↺',  label: 'NEW SHOT',  cls: 'done' },
    };
    const cfg = map[state] || map.idle;
    iconEl.textContent = cfg.icon;
    labelEl.textContent = cfg.label;
    btn.className = 'track-btn ' + cfg.cls;
  }

  _startTracking() {
    this.tracker.startTracking();
    this._setState('tracking');
  }

  _onShotComplete(trajectory) {
    const stats = this.physics.analyze(
      trajectory,
      this._el['video'].videoWidth,
      this._el['video'].videoHeight,
      this.calibration
    );
    this._setTrackingStatus('');
    if (!stats) {
      this._setState('ready');
      this._toast('Could not calculate stats – try again', 'warn');
      return;
    }

    this.currentStats = stats;
    this.sessionShots++;
    this.storage.saveShot({ stats });
    this._showStats(stats);
    this._updateSessionLabel();
    this._setState('reviewing');
  }

  _resetShot() {
    this.tracker.reset();
    this._el['stats-panel'].classList.add('hidden');
    this._setTrackingStatus('');
    this._setState('ready');
  }

  /* ── Demo mode ── */

  _runDemo() {
    if (this._state === 'tracking') return;
    const cw = this._el['trajectory-canvas'].width || 640;
    const ch = this._el['trajectory-canvas'].height || 480;
    const traj = this.physics.generateDemoTrajectory(
      cw * 0.1, ch * 0.8, cw, ch
    );
    this.tracker.drawFinalTrajectory(traj);
    const stats = this.physics.analyze(traj, cw, ch, null);
    this.currentStats = stats;
    this._showStats(stats);
    this._setState('reviewing');
    this._toast('Demo shot loaded!');
  }

  /* ── Stats panel ── */

  _showStats(stats) {
    this._el['stat-carry'].textContent = stats.carryDistance;
    this._el['stat-height'].textContent = stats.maxHeight;
    this._el['stat-angle'].textContent = stats.launchAngle + '°';
    this._el['stat-speed'].textContent = stats.ballSpeed;
    this._el['stats-panel'].classList.remove('hidden');
  }

  /* ── History panel ── */

  _openPanel(name) {
    if (name === 'history') this._renderHistory();
    if (name === 'settings') this._updateMetrics(0);
    this._el[`${name}-panel`].classList.add('open');
  }

  _closePanel(name) {
    this._el[`${name}-panel`].classList.remove('open');
  }

  _renderHistory() {
    const shots = this.storage.getShots();
    if (!shots.length) {
      this._el['history-list'].innerHTML =
        '<p class="empty-msg">No shots recorded yet.<br>Hit the TRACK button to begin!</p>';
      return;
    }
    this._el['history-list'].innerHTML = shots
      .map((shot) => {
        const d = new Date(shot.timestamp);
        const when =
          d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
          ' ' +
          d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const s = shot.stats;
        return `
          <div class="shot-card" data-id="${shot.id}">
            <div class="shot-meta">
              <span class="shot-time">${when}</span>
              <button class="del-btn" data-id="${shot.id}" aria-label="Delete">✕</button>
            </div>
            <div class="shot-stats">
              <div class="sstat"><span class="sv">${s.carryDistance}</span><span class="sl">yds carry</span></div>
              <div class="sstat"><span class="sv">${s.maxHeight}</span><span class="sl">ft height</span></div>
              <div class="sstat"><span class="sv">${s.launchAngle}°</span><span class="sl">angle</span></div>
              <div class="sstat"><span class="sv">${s.ballSpeed}</span><span class="sl">mph</span></div>
            </div>
          </div>`;
      })
      .join('');

    this._el['history-list'].querySelectorAll('.del-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.storage.deleteShot(parseInt(btn.dataset.id));
        this._renderHistory();
      });
    });
  }

  /* ── Helpers ── */

  _setTrackingStatus(text, animated = false) {
    this._el['tracking-status'].textContent = text;
    this._el['tracking-status'].dataset.animated = animated ? '1' : '';
  }

  _updateSessionLabel() {
    this._el['session-label'].textContent =
      `Session · ${this.sessionShots} shot${this.sessionShots !== 1 ? 's' : ''}`;
  }

  _toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    this._el['toast-container'].appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
    }, 3000);
  }

  _showCameraError(err) {
    const msg =
      err.name === 'NotAllowedError'
        ? 'Camera access denied. Please allow camera in your browser settings and reload.'
        : `Camera error: ${err.message}`;
    document.getElementById('camera-wrap').innerHTML = `
      <div class="cam-error">
        <div class="cam-err-icon">📷</div>
        <h2>Camera Unavailable</h2>
        <p>${msg}</p>
        <button onclick="location.reload()">Reload</button>
      </div>`;
  }

  _exportData() {
    const blob = new Blob([this.storage.exportJSON()], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `golf-shots-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ── Live camera metrics ── */

  _startMetrics() {
    if (this._metricsInterval) clearInterval(this._metricsInterval);

    // Count frames for live FPS
    const video = this._el['video'];
    let lastFrameCount = video.webkitDecodedFrameCount ?? 0;

    this._metricsInterval = setInterval(() => {
      this._updateMetrics(lastFrameCount);
      lastFrameCount = video.webkitDecodedFrameCount ?? lastFrameCount;
    }, 1000);

    // First render immediately
    this._updateMetrics(0);
  }

  _stopMetrics() {
    if (this._metricsInterval) {
      clearInterval(this._metricsInterval);
      this._metricsInterval = null;
    }
    this._el['metrics-live-dot'].classList.add('off');
  }

  _updateMetrics(prevFrameCount) {
    if (!this.stream) return;

    const track = this.stream.getVideoTracks()[0];
    if (!track || track.readyState !== 'live') {
      this._stopMetrics();
      return;
    }

    const s = track.getSettings();
    const caps = track.getCapabilities ? track.getCapabilities() : {};
    const video = this._el['video'];

    // Live FPS via decoded frame counter (webkit) or requestVideoFrameCallback
    const currentFrames = video.webkitDecodedFrameCount ?? 0;
    const fps = currentFrames - prevFrameCount;

    // Clean up label — strip internal iOS suffixes like " Back Camera"
    const rawLabel = track.label || '—';
    const shortLabel = rawLabel
      .replace(/\s*(Back|Front|Camera|Video)\s*/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim() || rawLabel;

    // Resolution: prefer actual video element dimensions (what's being rendered)
    const w = s.width  || video.videoWidth;
    const h = s.height || video.videoHeight;
    const res = w && h ? `${w}×${h}` : '—';

    // Facing
    const facing = s.facingMode
      ? (s.facingMode === 'environment' ? 'Rear' : 'Front')
      : '—';

    // Zoom
    const zoom = s.zoom != null
      ? `${s.zoom.toFixed(1)}×`
      : (caps.zoom ? '1.0×' : 'N/A');

    // Torch
    const torch = caps.torch != null
      ? (s.torch ? 'On' : 'Off')
      : 'N/A';

    // Focus mode
    const focus = s.focusMode
      ? s.focusMode.replace('continuous', 'cont.').replace('manual', 'manual')
      : (caps.focusMode ? caps.focusMode[0] : '—');

    // Exposure mode
    const expo = s.exposureMode
      ? s.exposureMode.replace('continuous', 'auto').replace('manual', 'manual')
      : (caps.exposureMode ? caps.exposureMode[0] : '—');

    // FPS capability range
    const fpsRange = caps.frameRate
      ? `Max capable: ${Math.round(caps.frameRate.min)}–${Math.round(caps.frameRate.max)} fps`
      : '';

    // Populate
    this._el['m-label'].textContent   = shortLabel;
    this._el['m-res'].textContent     = res;
    this._el['m-fps'].textContent     = fps > 0 ? `${fps} fps` : `${Math.round(s.frameRate || 0)} fps`;
    this._el['m-facing'].textContent  = facing;
    this._el['m-zoom'].textContent    = zoom;
    this._el['m-torch'].textContent   = torch;
    this._el['m-focus'].textContent   = focus;
    this._el['m-expo'].textContent    = expo;
    this._el['m-cap-fps'].textContent = fpsRange;

    this._el['metrics-live-dot'].classList.remove('off');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new GolfTrackerApp();
});
