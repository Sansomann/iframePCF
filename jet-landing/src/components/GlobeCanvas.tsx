import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

export default function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: canvas.offsetWidth * 2,
      height: canvas.offsetHeight * 2,
      phi: 0.6,
      theta: 0.3,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.79, 0.66, 0.3], // gold
      glowColor: [0.15, 0.12, 0.05],
      markers: [
        { location: [25.2048, 55.2708], size: 0.08 }, // Dubai
        { location: [51.5074, -0.1278], size: 0.07 },  // London
        { location: [40.7128, -74.006], size: 0.07 },  // New York
        { location: [35.6762, 139.6503], size: 0.06 }, // Tokyo
        { location: [46.2044, 6.1432], size: 0.06 },   // Geneva
        { location: [1.3521, 103.8198], size: 0.06 },  // Singapore
        { location: [48.8566, 2.3522], size: 0.06 },   // Paris
        { location: [25.0657, 55.1713], size: 0.05 },  // Abu Dhabi
        { location: [22.3193, 114.1694], size: 0.06 }, // Hong Kong
        { location: [43.7384, 7.4246], size: 0.05 },   // Monaco
      ],
      onRender(state) {
        phiRef.current += 0.003
        state.phi = phiRef.current
        state.width = canvas.offsetWidth * 2
        state.height = canvas.offsetHeight * 2
      },
    })

    return () => globe.destroy()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ aspectRatio: '1' }}
    />
  )
}
