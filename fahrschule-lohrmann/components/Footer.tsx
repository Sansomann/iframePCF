import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-white font-bold text-lg">
                FL
              </div>
              <div>
                <span className="text-white font-bold text-lg leading-none block">Fahrschule</span>
                <span className="text-accent-400 font-semibold text-sm leading-none tracking-wide">LOHRMANN</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Seit 1995 bringen wir unsere Schüler sicher ans Ziel. Professionell, kompetent und mit Herz.
            </p>
            <div className="mt-5 flex gap-3">
              {["facebook", "instagram"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-accent-500 hover:text-white transition-all"
                  aria-label={s}
                >
                  {s === "facebook" ? (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2} />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Startseite" },
                { href: "/kurse", label: "Kurskalender" },
                { href: "/simulator", label: "Simulator buchen" },
                { href: "/#leistungen", label: "Leistungen" },
                { href: "/#ueber-uns", label: "Über uns" },
                { href: "/#kontakt", label: "Kontakt" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-accent-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Leistungen */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Führerscheinklassen</h3>
            <ul className="space-y-2.5">
              {[
                "Klasse B (PKW)",
                "Klasse A (Motorrad)",
                "Klasse BE (Anhänger)",
                "Klasse AM (Mofa)",
                "Klasse L (Traktor)",
                "Fahrsimulator",
                "Intensivkurs",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-slate-400 hover:text-accent-400 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div id="kontakt">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <svg className="h-4 w-4 mt-0.5 text-accent-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-slate-400">Musterstraße 42<br />12345 Musterstadt</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <svg className="h-4 w-4 text-accent-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+491234567890" className="text-slate-400 hover:text-accent-400 transition-colors">
                  0123 / 456 78 90
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <svg className="h-4 w-4 text-accent-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@fahrschule-lohrmann.de" className="text-slate-400 hover:text-accent-400 transition-colors">
                  info@fahrschule-lohrmann.de
                </a>
              </li>
            </ul>

            <div className="mt-5 rounded-xl bg-white/5 p-4 text-sm">
              <p className="text-white font-medium mb-2">Öffnungszeiten</p>
              <div className="space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Mo – Fr</span>
                  <span>08:00 – 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sa</span>
                  <span>09:00 – 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>So</span>
                  <span>Geschlossen</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Fahrschule Lohrmann. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-5 text-sm">
            <Link href="#" className="text-slate-500 hover:text-accent-400 transition-colors">Impressum</Link>
            <Link href="#" className="text-slate-500 hover:text-accent-400 transition-colors">Datenschutz</Link>
            <Link href="#" className="text-slate-500 hover:text-accent-400 transition-colors">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
