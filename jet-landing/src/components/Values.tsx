import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VALUES } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function Values() {
  const sectionRef = useRef<HTMLElement>(null)
  const cloudRef1 = useRef<HTMLDivElement>(null)
  const cloudRef2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Slow drifting cloud layers
      gsap.to(cloudRef1.current, {
        x: '-8%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      })
      gsap.to(cloudRef2.current, {
        x: '5%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 3,
        },
      })

      // Card entrance
      gsap.fromTo(
        '.value-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="values" className="relative py-32 md:py-48 overflow-hidden">
      {/* Parallax sky background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* TODO: replace gradient with your own sky/clouds image */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2a] via-[#162232] to-[#0a0a0a]" />

        {/* Cloud layer 1 */}
        <div
          ref={cloudRef1}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 30% at 20% 40%, rgba(255,255,255,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 20% at 80% 60%, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
        />
        {/* Cloud layer 2 */}
        <div
          ref={cloudRef2}
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 50% 20% at 60% 30%, rgba(255,255,255,0.12) 0%, transparent 70%), radial-gradient(ellipse 70% 25% at 30% 70%, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="micro-label block mb-4">Why Aeronova</span>
          <h2 className="text-display text-cream" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            The Aeronova Standard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {VALUES.map((v) => (
            <article
              key={v.number}
              className="value-card group relative bg-surface p-8 md:p-10 flex flex-col gap-4 hover:bg-surface-2 transition-colors duration-500 opacity-0"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden mb-2">
                {/* TODO: replace with your own advantage images */}
                <img
                  src={v.image}
                  alt={v.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
              </div>

              <span className="micro-label text-gold/60">{v.number}</span>
              <h3 className="font-serif text-2xl text-cream font-light">{v.title}</h3>
              <p className="text-cream-muted text-sm leading-relaxed">{v.body}</p>

              {/* Gold rule — slides in on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
