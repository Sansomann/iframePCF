import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ADVANTAGES } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function Advantages() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const isMobile = window.innerWidth < 768

    if (!isMobile) {
      const ctx = gsap.context(() => {
        // Pin horizontal scroll
        const totalWidth = track.scrollWidth - section.offsetWidth
        gsap.to(track, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            invalidateOnRefresh: true,
          },
        })
      }, section)

      const resizeHandler = () => {
        ScrollTrigger.refresh()
      }
      window.addEventListener('resize', resizeHandler)
      return () => {
        ctx.revert()
        window.removeEventListener('resize', resizeHandler)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} id="advantages" className="overflow-hidden bg-surface">
      <div className="py-20 px-6 md:px-12 lg:px-24">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="micro-label block mb-4">Why Choose Us</span>
            <h2 className="text-display text-cream" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Advantages
            </h2>
          </div>
          <span className="text-cream-muted text-xs tracking-widest hidden md:block">
            ← SCROLL →
          </span>
        </div>
      </div>

      {/* Horizontal track — desktop: pinned scroll, mobile: grid */}
      <div className="md:overflow-visible overflow-x-auto pb-12 md:pb-0">
        <div
          ref={trackRef}
          className="flex gap-0 md:w-max"
        >
          {ADVANTAGES.map((adv, i) => (
            <article
              key={adv.title}
              className="group relative flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[38vw] lg:w-[30vw] min-w-[280px] flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[3/4]">
                {/* TODO: replace with your own advantage images */}
                <img
                  src={adv.image}
                  alt={adv.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Number overlay */}
                <span
                  className="absolute top-6 right-6 font-serif text-7xl text-white/5 font-light select-none"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-serif text-2xl md:text-3xl text-cream font-light mb-3">{adv.title}</h3>
                  <p className="text-cream-muted text-sm leading-relaxed">{adv.body}</p>
                </div>
              </div>

              {/* Gold bottom border on hover */}
              <div className="h-px bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
