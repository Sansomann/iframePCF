import { BRAND, FOOTER } from '../content'

interface Props {
  onBook: () => void
}

export default function Footer({ onBook }: Props) {
  return (
    <footer id="contact" className="border-t border-white/10 bg-surface">
      {/* CTA band */}
      <div className="px-6 md:px-12 lg:px-24 py-24 text-center border-b border-white/5">
        <span className="micro-label block mb-6">Ready to Fly?</span>
        <h2
          className="text-display text-cream mb-8"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
        >
          Your journey begins
          <br />
          <em className="text-gold not-italic">with one call.</em>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onBook} className="btn-gold">
            <span>Request a Charter</span>
          </button>
          <a href={`tel:${BRAND.phone}`} className="btn-ghost">
            <span>{BRAND.phone}</span>
          </a>
        </div>
      </div>

      {/* Footer nav */}
      <div className="px-6 md:px-12 lg:px-24 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3" aria-label="Aeronova home">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" className="text-gold">
            <polygon points="14,2 26,22 2,22" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <line x1="14" y1="8" x2="14" y2="22" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="font-serif text-lg tracking-widest text-cream">{BRAND.name}</span>
        </a>

        {/* Links */}
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          {FOOTER.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-cream-muted hover:text-cream tracking-widest uppercase transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copy */}
        <p className="text-xs text-cream-muted/60 tracking-wide">{FOOTER.copy}</p>
      </div>
    </footer>
  )
}
