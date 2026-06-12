import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLEET } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function Fleet() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.spec-row',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.fleet-specs',
            start: 'top 80%',
          },
        },
      )
      gsap.fromTo(
        '.fleet-image',
        { opacity: 0, scale: 1.05 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.fleet-image',
            start: 'top 85%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="fleet" className="py-32 md:py-48 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <span className="micro-label block mb-4">Our Fleet</span>
        <h2 className="text-display text-cream" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
          Aircraft of Excellence
        </h2>
      </div>

      {FLEET.map((aircraft) => (
        <div key={aircraft.id} className="space-y-16">
          {/* Aircraft header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="micro-label block mb-2">{aircraft.category}</span>
              <h3 className="font-serif text-4xl md:text-6xl text-cream font-light">{aircraft.name}</h3>
            </div>
            <p className="text-cream-muted text-sm leading-relaxed max-w-md">{aircraft.description}</p>
          </div>

          {/* Main aircraft image */}
          <div className="fleet-image relative overflow-hidden aspect-[16/7] opacity-0">
            {/* TODO: replace with your high-res aircraft photo */}
            <img
              src={aircraft.image}
              alt={aircraft.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          </div>

          {/* Specs + blueprint */}
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-start">
            {/* Spec table */}
            <div className="fleet-specs space-y-0 border border-white/10">
              {aircraft.specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`spec-row flex justify-between items-center px-6 py-4 opacity-0 ${
                    i % 2 === 0 ? 'bg-surface' : 'bg-surface-2'
                  }`}
                >
                  <span className="text-cream-muted text-xs tracking-widest uppercase">{spec.label}</span>
                  <span className="font-serif text-xl text-cream">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Blueprint / cabin image */}
            <div className="relative overflow-hidden aspect-[4/3]">
              <img
                src={aircraft.blueprintImage}
                alt={`${aircraft.name} cabin blueprint`}
                loading="lazy"
                className="w-full h-full object-cover opacity-80 grayscale"
              />
              {/* TODO: replace with your actual cabin blueprint image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="micro-label">Cabin Layout</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
