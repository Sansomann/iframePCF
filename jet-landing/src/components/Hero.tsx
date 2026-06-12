import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO } from '../content'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  onBook: () => void
}

export default function Hero({ onBook }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const midRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const line3Ref = useRef<HTMLSpanElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        // Staggered headline entrance
        const tl = gsap.timeline({ delay: 0.3 })
        tl.to([line1Ref.current, line2Ref.current, line3Ref.current], {
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.18,
        })
          .to(subRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
          .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')

        // Parallax on scroll
        gsap.to(bgRef.current, {
          y: '30%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
        gsap.to(midRef.current, {
          y: '15%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* BG layer — slowest parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[15%] scale-110"
        style={{ willChange: 'transform' }}
      >
        {/* TODO: replace src with your hero aircraft/window image */}
        <img
          src={HERO.bgImage}
          alt=""
          role="presentation"
          loading="eager"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
      </div>

      {/* Mid layer — medium parallax */}
      <div
        ref={midRef}
        className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none"
        style={{ willChange: 'transform' }}
      >
        {/* TODO: replace with your mid-layer aircraft silhouette or window framing image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Vignette edges */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.7) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <span className="micro-label block mb-8 opacity-80">Private Aviation Redefined</span>

        <h1 className="text-display mb-6 space-y-1">
          {HERO.lines.map((line, i) => (
            <span key={i} className="line-reveal-wrapper block">
              <span
                ref={i === 0 ? line1Ref : i === 1 ? line2Ref : line3Ref}
                className="line-reveal-inner block text-cream"
                style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className="text-cream-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10 opacity-0"
          style={{ transform: 'translateY(20px)' }}
        >
          {HERO.sub}
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0"
          style={{ transform: 'translateY(20px)' }}
        >
          <button onClick={onBook} className="btn-gold">
            <span>{HERO.cta}</span>
          </button>
          <a href="#about" className="btn-ghost">
            <span>Discover More</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="micro-label opacity-50">Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-gold opacity-60">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="8" cy="7" r="2.5" fill="currentColor" className="scroll-wheel">
            <animateTransform attributeName="transform" type="translate" values="0,0;0,9;0,0" dur="1.8s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
    </section>
  )
}
