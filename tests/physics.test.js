/* ShotPhysics tests */

function physicsTests(T) {
  T.describe('ShotPhysics');

  const p = new ShotPhysics();

  const makeTraj = (n = 20) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push({
        x: 100 + t * 300,
        y: 400 - Math.sin(t * Math.PI) * 120,
        t: i * 40,
      });
    }
    return pts;
  };

  T.test('returns null for empty trajectory', () => {
    T.equal(p.analyze([], 640, 480, null), null);
  });

  T.test('returns null for < 3 points', () => {
    T.equal(p.analyze([{ x: 0, y: 0, t: 0 }, { x: 10, y: 5, t: 40 }], 640, 480, null), null);
  });

  T.test('produces a result for valid trajectory', () => {
    const r = p.analyze(makeTraj(), 640, 480, null);
    T.ok(r !== null, 'result is not null');
  });

  T.test('all numeric fields are finite numbers >= 0', () => {
    const r = p.analyze(makeTraj(), 640, 480, null);
    const fields = ['carryDistance', 'totalDistance', 'maxHeight', 'launchAngle', 'ballSpeed', 'flightTime'];
    for (const f of fields) {
      T.ok(typeof r[f] === 'number', `${f} is number`);
      T.ok(isFinite(r[f]), `${f} is finite`);
      T.ok(r[f] >= 0, `${f} >= 0`);
    }
  });

  T.test('totalDistance >= carryDistance', () => {
    const r = p.analyze(makeTraj(), 640, 480, null);
    T.ok(r.totalDistance >= r.carryDistance, 'total >= carry');
  });

  T.test('launchAngle is in [0, 90]', () => {
    const r = p.analyze(makeTraj(), 640, 480, null);
    T.ok(r.launchAngle >= 0 && r.launchAngle <= 90, `angle ${r.launchAngle} in [0,90]`);
  });

  T.test('calibration scales carry distance correctly', () => {
    const traj = makeTraj(); // 300 px horizontal span
    // 300 px / 2 px-per-yd = 150 yds
    const r = p.analyze(traj, 640, 480, { pixelsPerYard: 2 });
    T.ok(Math.abs(r.carryDistance - 150) <= 2, `carry ~150 yds, got ${r.carryDistance}`);
  });

  T.test('estimateScale returns correct pixelsPerYard', () => {
    const scale = p.estimateScale(150, 300);
    T.ok(scale !== null, 'scale not null');
    T.ok(Math.abs(scale.pixelsPerYard - 2) < 0.001, `pxPerYard=2, got ${scale.pixelsPerYard}`);
  });

  T.test('estimateScale returns null for invalid inputs', () => {
    T.equal(p.estimateScale(0, 300), null);
    T.equal(p.estimateScale(150, 0), null);
  });

  T.test('flightTime equals time span of trajectory in seconds', () => {
    const traj = makeTraj(20); // 20 * 40ms = 800ms = 0.8s
    const r = p.analyze(traj, 640, 480, null);
    T.ok(Math.abs(r.flightTime - 0.8) < 0.05, `flightTime ~0.8s, got ${r.flightTime}`);
  });

  T.test('generateDemoTrajectory returns >= 20 points', () => {
    const pts = p.generateDemoTrajectory(50, 400, 640, 480);
    T.ok(pts.length >= 20, `got ${pts.length} points`);
  });

  T.test('trajectory in result has normalized timestamps starting at 0', () => {
    const r = p.analyze(makeTraj(), 640, 480, null);
    T.equal(r.trajectory[0].t, 0, 'first t = 0');
    T.ok(r.trajectory[r.trajectory.length - 1].t > 0, 'last t > 0');
  });
}
