import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 2000, startOnMount = false) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(startOnMount)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!startOnMount) {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setStarted(true) },
        { threshold: 0.5 },
      )
      if (ref.current) observer.observe(ref.current)
      return () => observer.disconnect()
    }
  }, [startOnMount])

  useEffect(() => {
    if (!started) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setCount(target); return }

    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return { count, ref }
}
