import { BRAND, FOOTER } from '../content'

interface Props {
  onBook: () => void
}

export default function Footer({ onBook }: Props) {
  return (
    <footer id="contact" className="border-t border-white/10 bg-surface">
      {/* CTA band */}
      <div className="px-6 md:px-12 lg:px-24 py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center border-b border-white/10">
        <div>
          <span className="micro-label block mb-4">Get In Touch</span>
          <h2 className="font-serif text-4xl md:text-6xl text-cream font-light leading-tight">
            Ready to depart?
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <a
            href={`mailto:${BRAND.email}`}
            className="group flex items-center justify-between border border-white/15 px-6 py-5 hover:border-gold transition-colors duration-300"
          >
            <div>
              <div className="micro-label mb-1 text-cream-muted">Email us</div>
              <div className="font-serif text-xl text-cream">{BRAND.email}</div>
            </div>
            <span className="text-gold text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
          </a>
          <a
            href={`tel:${BRAND.phone}`}
            className="group flex items-center justify-between border border-white/15 px-6 py-5 hover:border-gold transition-colors duration-300"
          >
            <div>
              <div className="micro-label mb-1 text-cream-muted">Call us</div>
              <div className="font-serif text-xl text-cream">{BRAND.phone}</div>
            </div>
            <span className="text-gold text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
          </a>
          <button onClick={onBook} className="btn-gold w-full justify-center py-4 mt-2">
            <span>Book the Flight</span>
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 md:px-12 lg:px-24 py-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" className="text-gold">
            <polygon points="14,2 26,22 2,22" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <line x1="14" y1="8" x2="14" y2="22" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="font-serif text-cream tracking-widest">{BRAND.name}</span>
        </div>
        <p className="text-cream-muted text-xs tracking-widest">{FOOTER.copy}</p>
        <div className="flex gap-6">
          {FOOTER.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-cream-muted text-xs tracking-widest hover:text-cream transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
