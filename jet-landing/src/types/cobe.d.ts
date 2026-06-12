declare module 'cobe' {
  interface Marker {
    location: [number, number]
    size: number
  }

  interface GlobeState {
    phi: number
    theta: number
    width: number
    height: number
    [key: string]: number
  }

  interface GlobeOptions {
    devicePixelRatio?: number
    width: number
    height: number
    phi?: number
    theta?: number
    dark?: number
    diffuse?: number
    mapSamples?: number
    mapBrightness?: number
    baseColor?: [number, number, number]
    markerColor?: [number, number, number]
    glowColor?: [number, number, number]
    markers?: Marker[]
    onRender?: (state: GlobeState) => void
  }

  export default function createGlobe(
    canvas: HTMLCanvasElement,
    options: GlobeOptions,
  ): { destroy: () => void }
}
