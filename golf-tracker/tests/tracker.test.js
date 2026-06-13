/* BallTracker tests */

function trackerTests(T) {
  T.describe('BallTracker');

  function makeTracker() {
    const fakeVideo = { readyState: 0, videoWidth: 640, videoHeight: 480 };
    const oc = document.createElement('canvas');
    const tc = document.createElement('canvas');
    return new BallTracker(fakeVideo, oc, tc);
  }

  // ── isTargetColor ──

  T.test('white: detects bright white (255,255,255)', () => {
    const tr = makeTracker();
    tr.setConfig({ ballColor: 'white' });
    T.ok(tr.isTargetColor(255, 255, 255), 'pure white detected');
  });

  T.test('white: does not detect dark gray (120,120,120)', () => {
    const tr = makeTracker();
    tr.setConfig({ ballColor: 'white' });
    T.ok(!tr.isTargetColor(120, 120, 120), 'dark gray rejected');
  });

  T.test('white: does not detect highly saturated red (240,20,20)', () => {
    const tr = makeTracker();
    tr.setConfig({ ballColor: 'white' });
    T.ok(!tr.isTargetColor(240, 20, 20), 'saturated red rejected');
  });

  T.test('yellow: detects (255,255,0)', () => {
    const tr = makeTracker();
    tr.setConfig({ ballColor: 'yellow' });
    T.ok(tr.isTargetColor(255, 255, 0), 'pure yellow detected');
  });

  T.test('yellow: does not detect white', () => {
    const tr = makeTracker();
    tr.setConfig({ ballColor: 'yellow' });
    T.ok(!tr.isTargetColor(255, 255, 255), 'white not yellow');
  });

  T.test('orange: detects (255,140,0)', () => {
    const tr = makeTracker();
    tr.setConfig({ ballColor: 'orange' });
    T.ok(tr.isTargetColor(255, 140, 0), 'orange detected');
  });

  T.test('orange: does not detect green (0,255,0)', () => {
    const tr = makeTracker();
    tr.setConfig({ ballColor: 'orange' });
    T.ok(!tr.isTargetColor(0, 255, 0), 'green rejected as orange');
  });

  // ── Kalman filter ──

  T.test('_kalman: first call returns exact measurement', () => {
    const tr = makeTracker();
    const r = tr._kalman(200, 300);
    T.equal(r.x, 200);
    T.equal(r.y, 300);
  });

  T.test('_kalman: subsequent call smooths toward measurement', () => {
    const tr = makeTracker();
    tr._kalman(200, 300);
    const r = tr._kalman(220, 280);
    T.ok(r.x > 200 && r.x < 225, `x ${r.x} smoothed`);
    T.ok(r.y > 275 && r.y < 305, `y ${r.y} smoothed`);
  });

  T.test('_kalman: does not NaN with large steps', () => {
    const tr = makeTracker();
    tr._kalman(0, 0);
    for (let i = 0; i < 30; i++) {
      const r = tr._kalman(i * 20, i * 15);
      T.ok(isFinite(r.x) && isFinite(r.y), `step ${i}: finite`);
    }
  });

  // ── _avgVelocity ──

  T.test('_avgVelocity: single point returns Infinity', () => {
    const tr = makeTracker();
    T.equal(tr._avgVelocity([{ x: 0, y: 0, t: 0 }]), Infinity);
  });

  T.test('_avgVelocity: 3-4-5 right triangle gives 5 px/frame', () => {
    const tr = makeTracker();
    const pts = [
      { x: 0, y: 0, t: 0 },
      { x: 3, y: 4, t: 40 },
      { x: 6, y: 8, t: 80 },
    ];
    T.ok(Math.abs(tr._avgVelocity(pts) - 5) < 0.01, 'avg vel = 5');
  });

  // ── State transitions ──

  T.test('startTracking resets trajectory and sets state=tracking', () => {
    const tr = makeTracker();
    tr.trajectory = [{ x: 1, y: 1, t: 0 }];
    tr.startTracking();
    T.equal(tr.state, 'tracking');
    T.equal(tr.trajectory.length, 0);
  });

  T.test('stopTracking with < minPoints fires trackingCancelled and goes to ready', () => {
    const tr = makeTracker();
    tr.config.minPoints = 5;
    tr.trajectory = [{ x: 0, y: 0, t: 0 }, { x: 10, y: 5, t: 40 }];
    let cancelled = false;
    tr.addEventListener('trackingCancelled', () => { cancelled = true; });
    tr.stopTracking(true);
    T.ok(cancelled, 'trackingCancelled fired');
    T.equal(tr.state, 'ready');
  });

  T.test('stopTracking with >= minPoints fires shotComplete and goes to reviewing', () => {
    const tr = makeTracker();
    tr.config.minPoints = 5;
    for (let i = 0; i < 10; i++) {
      tr.trajectory.push({ x: i * 20, y: 300 - i * 5, t: i * 40 });
    }
    tr.drawFinalTrajectory = () => {}; // stub canvas draw
    let completed = false;
    tr.addEventListener('shotComplete', () => { completed = true; });
    tr.stopTracking(true);
    T.ok(completed, 'shotComplete fired');
    T.equal(tr.state, 'reviewing');
  });

  T.test('reset clears trajectory and returns to ready', () => {
    const tr = makeTracker();
    tr.trajectory = [{ x: 1, y: 1, t: 0 }];
    tr.state = 'reviewing';
    tr.reset();
    T.equal(tr.state, 'ready');
    T.equal(tr.trajectory.length, 0);
  });

  T.test('getTrajectory returns a copy, not the internal array', () => {
    const tr = makeTracker();
    tr.trajectory = [{ x: 5, y: 5, t: 0 }];
    const copy = tr.getTrajectory();
    copy.push({ x: 99, y: 99, t: 100 });
    T.equal(tr.trajectory.length, 1, 'internal array unchanged');
  });
}
