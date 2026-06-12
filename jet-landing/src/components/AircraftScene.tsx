import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── Geometry helpers ────────────────────────────────────────────────────────

function makeWingGeo(
  span: number,
  rootLE: number, rootTE: number,
  tipLE: number,  tipTE: number,
  thickness: number,
): THREE.ExtrudeGeometry {
  // Shape defined in XY. After rotateX(PI/2): X→X(span), Y→Z(chord), Z→Y(thickness).
  const s = new THREE.Shape([
    new THREE.Vector2(0, rootLE),
    new THREE.Vector2(span, tipLE),
    new THREE.Vector2(span, tipTE),
    new THREE.Vector2(0, rootTE),
  ])
  const geo = new THREE.ExtrudeGeometry(s, { depth: thickness, bevelEnabled: false })
  geo.rotateX(Math.PI / 2)
  return geo
}

function addMirror(group: THREE.Group, mesh: THREE.Mesh) {
  const m = mesh.clone()
  m.scale.x = -1
  // clone position as well
  m.position.copy(mesh.position)
  group.add(m)
}

// ─── Aircraft builder ────────────────────────────────────────────────────────

function buildAircraft(): THREE.Group {
  const g = new THREE.Group()

  const silver = new THREE.MeshPhysicalMaterial({
    color: 0xdedad2, metalness: 0.85, roughness: 0.15, side: THREE.FrontSide,
  })
  const gold = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c, metalness: 0.96, roughness: 0.04,
  })
  const dark = new THREE.MeshStandardMaterial({
    color: 0x04070e, metalness: 0.5, roughness: 0.45,
  })
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x0a1828, roughness: 0.0, metalness: 0.0,
    transmission: 0.45, transparent: true, opacity: 0.88,
  })
  const exhaust = new THREE.MeshBasicMaterial({
    color: 0xff6510, transparent: true, opacity: 0.38,
  })

  // ── Fuselage (LatheGeometry, axis along Z after rotateX) ──────────────────
  const fPts: THREE.Vector2[] = [
    [0.003, -3.30], [0.055, -3.02], [0.14,  -2.56], [0.222, -1.90],
    [0.278, -1.10], [0.293,  0.00], [0.288,  1.00], [0.268,  1.80],
    [0.218,  2.42], [0.155,  2.88], [0.086,  3.17], [0.036,  3.32],
  ].map(([x, y]) => new THREE.Vector2(x, y))

  const fuselageGeo = new THREE.LatheGeometry(fPts, 36)
  fuselageGeo.rotateX(Math.PI / 2)  // nose → -Z, tail → +Z
  g.add(new THREE.Mesh(fuselageGeo, silver))

  // ── Main wings ────────────────────────────────────────────────────────────
  //   rLE=-0.35 (root leading edge), rTE=0.65 (root trailing edge)
  //   tLE= 0.52 (tip leading edge, swept back), tTE=0.82 (tip trailing edge)
  const mwGeo = makeWingGeo(2.68, -0.35, 0.65, 0.52, 0.82, 0.052)

  const wingR = new THREE.Mesh(mwGeo, silver)
  wingR.position.set(0, -0.13, 0)
  g.add(wingR)
  addMirror(g, wingR)

  // Winglets
  const wlGeo = new THREE.BoxGeometry(0.028, 0.30, 0.15)
  ;[1, -1].forEach(s => {
    const wl = new THREE.Mesh(wlGeo, silver)
    wl.position.set(s * 2.68, -0.02, 0.67)
    wl.rotation.z = s * 0.32
    g.add(wl)
  })

  // ── Engines (two underwing nacelles) ─────────────────────────────────────
  ;[1.20, -1.20].forEach(xPos => {
    // Nacelle body
    const nacGeo = new THREE.CylinderGeometry(0.10, 0.094, 0.84, 18)
    nacGeo.rotateZ(Math.PI / 2)
    const nac = new THREE.Mesh(nacGeo, silver)
    nac.position.set(xPos, -0.238, -0.08)
    g.add(nac)

    // Inlet ring
    const ringGeo = new THREE.TorusGeometry(0.10, 0.017, 8, 22)
    ringGeo.rotateY(Math.PI / 2)
    const ring = new THREE.Mesh(ringGeo, dark)
    ring.position.set(xPos, -0.238, -0.51)
    g.add(ring)

    // Exhaust glow disc
    const exhGeo = new THREE.CircleGeometry(0.070, 14)
    exhGeo.rotateY(-Math.PI / 2)
    const exhMesh = new THREE.Mesh(exhGeo, exhaust)
    exhMesh.position.set(xPos, -0.238, 0.50)
    g.add(exhMesh)

    // Pylon
    const pylGeo = new THREE.BoxGeometry(0.034, 0.105, 0.60)
    const pyl = new THREE.Mesh(pylGeo, silver)
    pyl.position.set(xPos, -0.178, -0.10)
    g.add(pyl)
  })

  // ── Horizontal stabilizer ─────────────────────────────────────────────────
  const hsGeo = makeWingGeo(1.10, -0.11, 0.26, 0.08, 0.26, 0.026)
  const hsR = new THREE.Mesh(hsGeo, silver)
  hsR.position.set(0, 0.03, 2.64)
  g.add(hsR)
  addMirror(g, hsR)

  // ── Vertical stabilizer ──────────────────────────────────────────────────
  // Shape in XY: X=chord (→ world Z after rotateY(PI/2)), Y=height (→ world Y)
  const vsShape = new THREE.Shape([
    new THREE.Vector2(0,    0),
    new THREE.Vector2(0.26, 0.76),
    new THREE.Vector2(0.57, 0.76),
    new THREE.Vector2(0.64, 0),
  ])
  const vsGeo = new THREE.ExtrudeGeometry(vsShape, { depth: 0.034, bevelEnabled: false })
  vsGeo.rotateY(Math.PI / 2)  // chord→Z, thickness→X
  const vs = new THREE.Mesh(vsGeo, silver)
  vs.position.set(0.017, 0.14, 2.46)
  g.add(vs)

  // ── Gold cheatline (both sides) ───────────────────────────────────────────
  ;[0.294, -0.294].forEach(xPos => {
    const cPts = Array.from({ length: 50 }, (_, i) => {
      return new THREE.Vector3(xPos, 0.068, -3.05 + (i / 49) * 6.10)
    })
    const cGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(cPts), 64, 0.0078, 6, false,
    )
    g.add(new THREE.Mesh(cGeo, gold))
  })

  // ── Cabin windows ─────────────────────────────────────────────────────────
  const winGeo = new THREE.BoxGeometry(0.009, 0.052, 0.038)
  for (let i = 0; i < 9; i++) {
    const z = -1.88 + i * 0.40
    ;[0.293, -0.293].forEach(xPos => {
      const w = new THREE.Mesh(winGeo, glass)
      w.position.set(xPos, 0.12, z)
      g.add(w)
    })
  }

  // Cockpit windows
  const ckGeo = new THREE.BoxGeometry(0.009, 0.068, 0.084)
  for (let i = 0; i < 2; i++) {
    ;[0.284, -0.284].forEach(xPos => {
      const cw = new THREE.Mesh(ckGeo, glass)
      cw.position.set(xPos, 0.165, -2.72 + i * 0.11)
      g.add(cw)
    })
  }

  return g
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AircraftScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    renderer.domElement.style.cssText = 'position:absolute;inset:0;'
    mount.appendChild(renderer.domElement)

    // Scene + camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(2.8, 1.6, 8.0)
    camera.lookAt(0, 0, 0)

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.10))

    const key = new THREE.DirectionalLight(0xfff8e4, 3.0)
    key.position.set(5, 9, 4)
    scene.add(key)

    const rim = new THREE.DirectionalLight(0x2244cc, 1.2)
    rim.position.set(-7, 1, -5)
    scene.add(rim)

    const under = new THREE.PointLight(0xc9a84c, 2.5, 10)
    under.position.set(0, -2.8, 1)
    scene.add(under)

    const accent = new THREE.PointLight(0x4488ff, 0.6, 12)
    accent.position.set(0, 3, -3)
    scene.add(accent)

    // Simple env map for metallic reflections
    const pmrem = new THREE.PMREMGenerator(renderer)
    pmrem.compileEquirectangularShader()
    const envSc = new THREE.Scene()
    envSc.background = new THREE.Color(0x0a0a14)
    scene.environment = pmrem.fromScene(envSc, 0.04).texture
    pmrem.dispose()

    // Aircraft
    const aircraft = buildAircraft()
    aircraft.rotation.y = 0.30   // three-quarter view on load
    aircraft.rotation.x = 0.06   // slight nose-up attitude
    scene.add(aircraft)

    // Background star field
    const sp = new Float32Array(700 * 3).map(() => (Math.random() - 0.5) * 55)
    const sGeo = new THREE.BufferGeometry()
    sGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.022, transparent: true, opacity: 0.42,
    })))

    // Animation loop
    let raf: number
    let t = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!prefersReduced) {
        aircraft.rotation.y += 0.0022
        t += 0.007
        aircraft.position.y = Math.sin(t) * 0.062
      }
      renderer.render(scene, camera)
    }
    tick()

    // Responsive resize
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full relative" />
}
