/* Golf shot data persistence */

class ShotStorage {
  constructor() {
    this.SHOTS_KEY = 'golf_shots_v1';
    this.SETTINGS_KEY = 'golf_settings_v1';
  }

  getShots() {
    try {
      return JSON.parse(localStorage.getItem(this.SHOTS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  saveShot(shot) {
    const shots = this.getShots();
    const record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...shot,
    };
    shots.unshift(record);
    localStorage.setItem(this.SHOTS_KEY, JSON.stringify(shots));
    return record;
  }

  deleteShot(id) {
    const shots = this.getShots().filter((s) => s.id !== id);
    localStorage.setItem(this.SHOTS_KEY, JSON.stringify(shots));
  }

  clearAll() {
    localStorage.removeItem(this.SHOTS_KEY);
  }

  exportJSON() {
    return JSON.stringify(this.getShots(), null, 2);
  }

  getSettings() {
    try {
      return JSON.parse(
        localStorage.getItem(this.SETTINGS_KEY) ||
          '{"ballColor":"white","knownDistance":150,"cameraId":null}'
      );
    } catch {
      return { ballColor: 'white', knownDistance: 150, cameraId: null };
    }
  }

  saveSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }
}
