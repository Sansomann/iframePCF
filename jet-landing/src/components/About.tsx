import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ABOUT } from '../content'
import { useCountUp } from '../hooks/useCountUp'

gsap.registerPlugin(ScrollTrigger)

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value, 2200)
  return (
    <div className="text-center">
      <div className="font-serif text-5xl md:text-6xl text-cream font-light">
        <span ref={ref}>{count}</span>
        <span className="text-gold">{suffix}</span>
      </div>
      <div className="micro-label mt-2 text-cream-muted">{label}</div>
    </div>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Word-by-word reveal
      const div = wordsRef.current
      if (!div) return

      const words = div.querySelectorAll<HTMLSpanElement>('.word')
      gsap.fromTo(
        words,
        { opacity: 0.15, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          ease: 'power2.out',
          duration: 0.5,
          scrollTrigger: {
            trigger: div,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 0.5,
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Split paragraph into word spans
  const words = ABOUT.paragraph.split(/\s+/)

  return (
    <section ref={sectionRef} id="about" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
        {/* Left label column */}
        <div className="space-y-6">
          <span className="micro-label block">{ABOUT.label}</span>
          <span className="gold-rule" />
          <p className="text-cream-muted text-sm leading-relaxed">
            Dubai, UAE — globally connected.
          </p>
        </div>

        {/* Right text column */}
        <div>
          <div
            ref={wordsRef}
            className="font-serif text-2xl md:text-3xl lg:text-4xl text-cream font-light leading-[1.4] mb-16"
          >
            {words.map((w, i) => (
              <span key={i} className="word inline-block mr-[0.28em]" style={{ opacity: 0.15 }}>
                {w}
              </span>
            ))}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
            {ABOUT.stats.map((s) => (
              <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
