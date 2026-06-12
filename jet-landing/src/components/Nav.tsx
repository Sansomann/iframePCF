import { useEffect, useRef } from 'react'
import { BRAND, NAV_LINKS } from '../content'

interface Props {
  onBook: () => void
}

export default function Nav({ onBook }: Props) {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const handler = () => {
      const scrolled = window.scrollY > 60
      nav.style.background = scrolled ? 'rgba(10,10,10,0.92)' : 'transparent'
      nav.style.backdropFilter = scrolled ? 'blur(16px)' : 'none'
      nav.style.borderBottomColor = scrolled ? 'rgba(201,168,76,0.15)' : 'transparent'
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 transition-all duration-500 border-b border-transparent"
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-3 group" aria-label="Aeronova home">
        {/* TODO: replace this inline SVG with your real logo */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-gold">
          <polygon points="14,2 26,22 2,22" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="14" y1="8" x2="14" y2="22" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="font-serif text-xl tracking-widest text-cream group-hover:text-gold-light transition-colors">
          {BRAND.name}
        </span>
      </a>

      {/* Center nav links — hidden on small screens */}
      <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="btn-ghost text-cream-muted hover:text-cream py-1 px-0">
            {link.label}
          </a>
        ))}
      </nav>

      {/* Right: contact + CTA */}
      <div className="hidden lg:flex items-center gap-6">
        <a href={`tel:${BRAND.phone}`} className="text-xs text-cream-muted tracking-widest hover:text-cream transition-colors">
          {BRAND.phone}
        </a>
        <button onClick={onBook} className="btn-gold">
          <span>Book the Flight</span>
        </button>
      </div>

      {/* Mobile CTA only */}
      <button onClick={onBook} className="btn-gold lg:hidden text-[10px] px-4 py-2">
        <span>Book</span>
      </button>
    </header>
  )
}
