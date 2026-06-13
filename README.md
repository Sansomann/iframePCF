# ⛳ Golf Ball Tracker

A Toptracer-style Progressive Web App for iPhone that tracks your golf shots using your phone's camera. Tap **TRACK**, hit the ball, and see the trajectory arc, carry distance, max height, launch angle, and ball speed instantly.

## Features

- **Live camera tracking** — uses rear camera, detects white / yellow / orange balls via motion + color analysis with Kalman filter smoothing
- **Trajectory visualization** — glowing gradient arc with peak marker, height line, and carry distance indicator
- **Shot statistics** — carry distance (yds), max height (ft), launch angle (°), ball speed (mph)
- **Shot history** — persistent log with per-shot delete and JSON export
- **Demo mode** — preview trajectory display without a ball (🏌️ button)
- **PWA** — add to iPhone home screen for full-screen, offline-capable use
- **Calibration** — enter known target distance for accurate yardage

## Quick Start

```bash
# 1. Clone or download
git clone https://github.com/sansomann/golf-ball-tracker.git
cd golf-ball-tracker

# 2. Serve locally (camera requires HTTPS or localhost)
npx serve .
# or
python3 -m http.server 8080

# 3. Open on iPhone
# http://<your-local-ip>:8080
# For HTTPS use: npx local-ssl-proxy --source 8443 --target 8080
```

Then open the URL on your iPhone in Safari → tap **Share → Add to Home Screen**.

## Tips for Best Tracking

| Condition | Recommendation |
|---|---|
| Shot distance | Best for chip shots / short irons < 80 yds |
| Camera angle | Film from the side, perpendicular to shot direction |
| Lighting | Bright overcast > direct sun (reduces glare) |
| Background | Blue sky or green grass behind the ball path |
| Stability | Rest phone on a stand or tripod |

> **Note:** Golf ball detection from a phone camera is genuinely hard — the ball is tiny at range and travels faster than 30fps can reliably capture. Use **Demo mode** to see what a tracked shot looks like, and start with close chip shots to calibrate.

## Project Structure

```
golf-tracker/
├── index.html            # Main app shell
├── manifest.json         # PWA manifest
├── sw.js                 # Service worker (offline cache)
├── css/
│   └── styles.css        # iPhone-optimised dark theme
├── js/
│   ├── storage.js        # LocalStorage shot persistence
│   ├── physics.js        # Trajectory analysis & distance calc
│   ├── tracker.js        # Ball detection, Kalman filter, canvas drawing
│   └── app.js            # App controller, camera, UI state machine
└── tests/
    ├── test.html          # In-browser test runner (open in browser)
    ├── storage.test.js    # 7 storage tests
    ├── physics.test.js    # 11 physics tests
    └── tracker.test.js    # 14 tracker tests
```

## Running Tests

Open `tests/test.html` in any browser — no build step needed. All 32 tests run inline and show pass/fail with error messages.

## How It Works

1. **Frame capture** — every animation frame, a scaled-down copy (30% size) of the video is drawn to an offscreen canvas
2. **Motion detection** — pixel-by-pixel diff between current and previous frame finds moving regions
3. **Color filter** — moving pixels are checked against the target ball color (brightness + saturation for white; hue range for yellow/orange)
4. **Centroid** — the mean x/y of matched pixels gives the ball position
5. **Kalman filter** — a 2D Kalman filter smooths noise and predicts through brief occlusions
6. **Auto-stop** — tracking ends when average velocity drops below 3 px/frame or ball leaves frame
7. **Physics** — pixel distances are scaled to yards using a calibration factor; launch angle, height, and speed are derived from trajectory geometry

## License

MIT
