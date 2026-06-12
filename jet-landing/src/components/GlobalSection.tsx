import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESTINATIONS, GLOBE_STATS, BRAND } from '../content'
import { useCountUp } from '../hooks/useCountUp'
import GlobeCanvas from './GlobeCanvas'

gsap.registerPlugin(ScrollTrigger)

function LocalClock({ timezone }: { timezone: string }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: timezone,
        }).format(new Date()),
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [timezone])

  return <span className="tabular-nums">{time}</span>
}

// Double the array for seamless marquee loop
const doubled = [...DESTINATIONS, ...DESTINATIONS]

export default function GlobalSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { count: count1, ref: ref1 } = useCountUp(GLOBE_STATS[0].value, 2500)
  const { count: count2, ref: ref2 } = useCountUp(GLOBE_STATS[1].value, 2000)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.global-content > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power2.out',
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
    <section ref={sectionRef} id="global" className="relative py-32 md:py-48 bg-surface overflow-hidden">
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left — text + stats */}
          <div className="global-content space-y-10">
            <div>
              <span className="micro-label block mb-4">Global Reach</span>
              <h2 className="text-display text-cream" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                Everywhere
                <br />
                <em className="text-gold not-italic">you need to be</em>
              </h2>
            </div>

            <p className="text-cream-muted text-sm leading-relaxed max-w-md">
              Aeronova operates across 174 countries with an active network of 320+ verified operators. Whether you need to reach a private island, a mountain airstrip, or a major financial centre, our dispatch team makes it seamless.
            </p>

            {/* Stat row */}
            <div className="flex gap-12">
              {GLOBE_STATS.map((stat, i) => (
                <div key={stat.label}>
                  <div className="font-serif text-4xl text-cream font-light">
                    <span ref={i === 0 ? ref1 : ref2}>{i === 0 ? count1 : count2}</span>
                    <span className="text-gold">+</span>
                  </div>
                  <div className="micro-label mt-1 text-cream-muted">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Live clocks */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { city: 'Dubai', tz: 'Asia/Dubai' },
                { city: 'London', tz: 'Europe/London' },
                { city: 'New York', tz: 'America/New_York' },
              ].map(({ city, tz }) => (
                <div key={city} className="text-center">
                  <div className="font-serif text-lg text-cream">
                    <LocalClock timezone={tz} />
                  </div>
                  <div className="micro-label mt-1 text-cream-muted/70">{city}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Globe */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-[500px] aspect-square">
              <GlobeCanvas />
            </div>
            {/* Radial fade over globe edges */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 80% 80% at center, transparent 50%, rgba(17,17,17,1) 100%)',
              }}
            />
          </div>
        </div>

        {/* Destination marquee */}
        <div className="mt-24 overflow-hidden">
          <p className="micro-label mb-4 text-center">Destinations We Serve</p>
          <div className="relative flex overflow-hidden">
            <div className="flex animate-marquee marquee-track whitespace-nowrap">
              {doubled.map((dest, i) => (
                <span key={i} className="inline-flex items-center gap-4 px-6 text-cream-muted text-xs tracking-widest uppercase">
                  {dest}
                  <span className="text-gold/40" aria-hidden>&#9632;</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Base info */}
        <div className="mt-16 flex flex-wrap justify-between items-center gap-4 border-t border-white/10 pt-8">
          <div className="flex items-center gap-3">
            <span className="gold-rule" />
            <span className="text-cream-muted text-xs tracking-widest uppercase">{BRAND.base} — Primary Operations Hub</span>
          </div>
          <a
            href={`mailto:${BRAND.email}`}
            className="text-xs text-cream-muted hover:text-cream tracking-widest transition-colors"
          >
            {BRAND.email}
          </a>
        </div>
      </div>
    </section>
  )
}
