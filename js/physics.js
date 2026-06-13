/* Shot physics — trajectory analysis and distance estimation */

class ShotPhysics {
  analyze(trajectory, videoWidth, videoHeight, calibration) {
    if (!trajectory || trajectory.length < 3) return null;

    const first = trajectory[0];
    const last = trajectory[trajectory.length - 1];

    // Find peak (lowest screen-y = highest physical altitude)
    let peak = trajectory[0];
    for (const pt of trajectory) {
      if (pt.y < peak.y) peak = pt;
    }

    const pixelCarry = Math.abs(last.x - first.x);
    const pixelRise = Math.abs(peak.y - first.y);

    // pixels → yards conversion
    let pxPerYard = 2; // default: ~2 px/yd at 150-yard calibration on HD video
    if (calibration && calibration.pixelsPerYard > 0) {
      pxPerYard = calibration.pixelsPerYard;
    }

    const carryDistance = Math.round(pixelCarry / pxPerYard);
    const heightYards = pixelRise / pxPerYard;
    const maxHeight = Math.round(heightYards * 3); // yards → feet

    // Launch angle from start → peak horizontal/vertical vectors
    const dx = Math.abs(peak.x - first.x);
    const dy = Math.abs(peak.y - first.y); // dy in pixels, peak is up
    const launchAngle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);

    // Ball speed from initial frame velocity (pixels/ms × scale → mph)
    let ballSpeed = 0;
    if (trajectory.length >= 2) {
      const dt = (trajectory[1].t - trajectory[0].t) / 1000; // ms→s
      if (dt > 0) {
        const dxPx = trajectory[1].x - trajectory[0].x;
        const dyPx = trajectory[1].y - trajectory[0].y;
        const pxPerSec = Math.sqrt(dxPx * dxPx + dyPx * dyPx) / dt;
        const yardsPerSec = pxPerSec / pxPerYard;
        ballSpeed = Math.round(yardsPerSec * 3600 / 1760); // yd/s → mph
      }
    }

    const flightTime = parseFloat(
      ((last.t - first.t) / 1000).toFixed(1)
    );

    return {
      carryDistance: Math.max(0, carryDistance),
      totalDistance: Math.max(0, Math.round(carryDistance * 1.08)),
      maxHeight: Math.max(0, maxHeight),
      launchAngle: Math.max(0, Math.min(90, launchAngle)),
      ballSpeed: Math.max(0, ballSpeed),
      flightTime: Math.max(0, flightTime),
      trajectory: trajectory.map((pt) => ({
        x: pt.x,
        y: pt.y,
        t: pt.t - first.t,
      })),
    };
  }

  estimateScale(knownDistanceYards, pixelWidth) {
    if (pixelWidth <= 0 || knownDistanceYards <= 0) return null;
    return { pixelsPerYard: pixelWidth / knownDistanceYards };
  }

  /* Generate a simulated parabolic shot for demo mode */
  generateDemoTrajectory(startX, startY, canvasWidth, canvasHeight) {
    const points = [];
    const steps = 40;
    const endX = startX + canvasWidth * 0.6;
    const peakY = startY - canvasHeight * 0.35;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Quadratic Bezier gives parabolic arc
      const bx = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * (startX + (endX - startX) * 0.45) + t * t * endX;
      const by =
        (1 - t) * (1 - t) * startY +
        2 * (1 - t) * t * peakY +
        t * t * startY;
      points.push({ x: bx, y: by, t: i * 40 });
    }
    return points;
  }
}
