import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESTINATIONS, GLOBE_STATS, BRAND } from '../content'
import { useCountUp } from '../hooks/useCountUp'
import AircraftScene from './AircraftScene'

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
    <section ref={sectionRef} id="global" className="relative py-32 md:py-48 overflow-hidden bg-surface">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: info */}
          <div className="global-content space-y-10">
            <div>
              <span className="micro-label block mb-4">Global Reach</span>
              <h2 className="text-display text-cream" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                Everywhere you need to be.
              </h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-white/10 p-6">
                <div className="font-serif text-4xl text-cream font-light">
                  <span ref={ref1}>{count1}</span>
                  <span className="text-gold"> +</span>
                </div>
                <div className="micro-label mt-1 text-cream-muted">{GLOBE_STATS[0].label}</div>
              </div>
              <div className="border border-white/10 p-6">
                <div className="font-serif text-4xl text-cream font-light">
                  <span ref={ref2}>{count2}</span>
                  <span className="text-gold"> +</span>
                </div>
                <div className="micro-label mt-1 text-cream-muted">{GLOBE_STATS[1].label}</div>
              </div>
            </div>

            {/* Base + local time */}
            <div className="flex items-center gap-4 border border-white/10 p-5">
              <div>
                <span className="micro-label block text-cream-muted mb-1">Based In</span>
                <span className="font-serif text-xl text-cream">{BRAND.base}</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <span className="micro-label block text-cream-muted mb-1">Local Time</span>
                <span className="font-serif text-xl text-cream">
                  <LocalClock timezone="Asia/Dubai" />
                </span>
              </div>
            </div>
          </div>

          {/* Right: Globe */}
          <div className="relative flex items-center justify-center">
            <div className="w-full aspect-[4/3] relative">
              <AircraftScene />
            </div>
          </div>
        </div>
      </div>

      {/* Destination marquee */}
      <div className="mt-20 overflow-hidden border-t border-b border-white/10 py-4">
        <div className="flex gap-12 animate-marquee marquee-track whitespace-nowrap">
          {doubled.map((city, i) => (
            <span key={i} className="flex items-center gap-12">
              <span className="font-serif text-lg text-cream/40 hover:text-gold transition-colors cursor-default">
                {city}
              </span>
              <span className="text-gold/30 text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
