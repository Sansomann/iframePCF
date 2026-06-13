/* ShotStorage tests */

function storageTests(T) {
  T.describe('ShotStorage');

  T.test('getShots returns [] when empty', () => {
    const s = new ShotStorage();
    s.clearAll();
    T.equal(s.getShots().length, 0);
  });

  T.test('saveShot persists and returns record with id/timestamp', () => {
    const s = new ShotStorage();
    s.clearAll();
    const rec = s.saveShot({ stats: { carryDistance: 120 } });
    T.ok(typeof rec.id === 'number', 'id is a number');
    T.ok(typeof rec.timestamp === 'string', 'timestamp is a string');
    T.equal(s.getShots().length, 1);
  });

  T.test('saveShot prepends (newest first)', () => {
    const s = new ShotStorage();
    s.clearAll();
    s.saveShot({ stats: { carryDistance: 100 } });
    s.saveShot({ stats: { carryDistance: 200 } });
    const shots = s.getShots();
    T.equal(shots[0].stats.carryDistance, 200);
  });

  T.test('deleteShot removes the correct record', () => {
    const s = new ShotStorage();
    s.clearAll();
    const r1 = s.saveShot({ stats: { carryDistance: 100 } });
    const r2 = s.saveShot({ stats: { carryDistance: 200 } });
    s.deleteShot(r1.id);
    const remaining = s.getShots();
    T.equal(remaining.length, 1);
    T.equal(remaining[0].id, r2.id);
  });

  T.test('clearAll removes everything', () => {
    const s = new ShotStorage();
    s.saveShot({ stats: { carryDistance: 150 } });
    s.clearAll();
    T.equal(s.getShots().length, 0);
  });

  T.test('exportJSON returns valid JSON array', () => {
    const s = new ShotStorage();
    s.clearAll();
    s.saveShot({ stats: { carryDistance: 130 } });
    const json = s.exportJSON();
    const parsed = JSON.parse(json);
    T.ok(Array.isArray(parsed), 'parsed is array');
    T.equal(parsed.length, 1);
  });

  T.test('getSettings / saveSettings round-trips', () => {
    const s = new ShotStorage();
    s.saveSettings({ ballColor: 'yellow', knownDistance: 200, cameraId: 'abc' });
    const back = s.getSettings();
    T.equal(back.ballColor, 'yellow');
    T.equal(back.knownDistance, 200);
    T.equal(back.cameraId, 'abc');
    // Restore default
    s.saveSettings({ ballColor: 'white', knownDistance: 150, cameraId: null });
  });

  T.test('getShots handles corrupted localStorage gracefully', () => {
    localStorage.setItem('golf_shots_v1', 'INVALID_JSON{{');
    const s = new ShotStorage();
    T.equal(s.getShots().length, 0);
    s.clearAll();
  });
}
