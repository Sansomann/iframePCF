import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STATS } from '../content'
import { useCountUp } from '../hooks/useCountUp'

gsap.registerPlugin(ScrollTrigger)

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const { count, ref } = useCountUp(5000, 3000)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stats-content',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      )

      // Horizontal marquee-like line animation
      gsap.fromTo(
        '.stats-rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power3.out',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden bg-black"
    >
      {/* Giant number watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span className="font-serif text-[30vw] text-white/[0.02] font-light leading-none">
          <span ref={ref}>{count}</span>+
        </span>
      </div>

      <div className="stats-content relative z-10 max-w-4xl mx-auto text-center opacity-0">
        <span className="micro-label block mb-8">{STATS.label}</span>
        <hr className="stats-rule border-none h-px bg-gold mb-12 origin-left" style={{ transform: 'scaleX(0)' }} />
        <h2
          className="text-display text-cream mb-8"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}
        >
          {STATS.headline}
        </h2>
        <p className="text-cream-muted text-sm leading-relaxed max-w-xl mx-auto">
          {STATS.body}
        </p>
      </div>
    </section>
  )
}
