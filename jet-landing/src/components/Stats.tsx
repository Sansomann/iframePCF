import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STATS } from '../content'
import { useCountUp } from '../hooks/useCountUp'

gsap.registerPlugin(ScrollTrigger)

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const { count, ref } = useCountUp(5000, 2500)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stats-content > *',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
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
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto stats-content">
        <span className="micro-label block mb-6">{STATS.label}</span>

        <h2 className="font-serif text-cream font-light leading-tight mb-8"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}>
          <span ref={ref}>{count.toLocaleString()}</span>
          <span className="text-gold">+</span>
          <br />
          <span className="text-cream-muted" style={{ fontSize: '0.6em' }}>
            flights successfully arranged.
          </span>
        </h2>

        <div className="w-12 h-px bg-gold mb-8" />

        <p className="text-cream-muted text-base md:text-lg leading-relaxed max-w-2xl">
          {STATS.body}
        </p>
      </div>
    </section>
  )
}
