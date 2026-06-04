import Link from "next/link";

const stats = [
  { value: "1.200+", label: "erfolgreiche Absolventen" },
  { value: "97%", label: "Bestehensquote" },
  { value: "30+", label: "Jahre Erfahrung" },
  { value: "3", label: "Fahrsimulatoren" },
];

const services = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Führerschein Klasse B",
    subtitle: "PKW · Standard",
    description:
      "Ihr Einstieg in die Mobilität. Wir begleiten Sie von der Theorie bis zur erfolgreichen Prüfung – flexibel und individuell.",
    price: "ab 1.850 €",
    color: "blue",
    href: "/kurse",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Fahrsimulator",
    subtitle: "Training & Übung",
    description:
      "Üben Sie kritische Situationen risikofrei. Unser moderner Fahrsimulator bereitet Sie optimal auf die Praxis vor.",
    price: "ab 35 € / Stunde",
    color: "amber",
    href: "/simulator",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Intensivkurs",
    subtitle: "Führerschein in 3 Wochen",
    description:
      "Schnell zum Ziel: Unser Intensivkurs ermöglicht Ihnen den Führerschein in kürzester Zeit – ohne Abstriche bei der Qualität.",
    price: "auf Anfrage",
    color: "green",
    href: "/kurse",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Theorieunterricht",
    subtitle: "Online & Präsenz",
    description:
      "Flexibler Theorieunterricht – wahlweise in unseren modernen Schulungsräumen oder online von zu Hause aus.",
    price: "inklusive",
    color: "purple",
    href: "/kurse",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Erste Hilfe Kurs",
    subtitle: "Pflichtnachweis",
    description:
      "Lebensrettende Maßnahmen kompakt: Unser Erste-Hilfe-Kurs wird für alle Führerscheinklassen als Nachweis anerkannt.",
    price: "35 €",
    color: "red",
    href: "/kurse",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: "Sehtest & Passbild",
    subtitle: "Komplettservice",
    description:
      "Alles aus einer Hand: Sehtest und Passbilder direkt bei uns – kein extra Termin beim Optiker nötig.",
    price: "25 €",
    color: "teal",
    href: "/kurse",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-600",
  teal: "bg-teal-50 text-teal-600",
};

const steps = [
  {
    num: "01",
    title: "Anmelden & Beratung",
    desc: "Melden Sie sich online oder persönlich an. Wir beraten Sie kostenlos zu Führerscheinklasse und Kursoptionen.",
  },
  {
    num: "02",
    title: "Theorie & Simulator",
    desc: "Theorieunterricht (Präsenz oder Online), Erste Hilfe, Sehtest – alles strukturiert und effizient.",
  },
  {
    num: "03",
    title: "Fahrstunden & Prüfung",
    desc: "Praktische Ausbildung mit erfahrenen Fahrlehrern. Nach dem Simulator-Training zur Prüfung – und fertig!",
  },
];

const testimonials = [
  {
    name: "Laura M.",
    age: 19,
    rating: 5,
    text: "Mega nette Atmosphäre und super Fahrlehrerin! Beim ersten Versuch bestanden – ich bin so stolz. Kann Fahrschule Lohrmann nur weiterempfehlen!",
    class: "Klasse B",
  },
  {
    name: "Tim R.",
    age: 24,
    rating: 5,
    text: "Der Fahrsimulator war wirklich hilfreich, um das Fahren auf der Autobahn zu üben, bevor es ernst wurde. Top Vorbereitung!",
    class: "Klasse B + Simulator",
  },
  {
    name: "Sandra K.",
    age: 32,
    rating: 5,
    text: "Als Erwachsener nochmal die Fahrschule – ich hatte Bedenken. Aber das Team war so geduldig und professionell. Innerhalb von 6 Wochen Führerschein!",
    class: "Intensivkurs",
  },
];

const upcomingClasses = [
  { date: "09.06.", day: "Mo", title: "Theorieunterricht", time: "18:00 – 20:00", spots: 4, type: "theory" },
  { date: "11.06.", day: "Mi", title: "Theorieunterricht", time: "18:00 – 20:00", spots: 6, type: "theory" },
  { date: "14.06.", day: "Sa", title: "Erste Hilfe Kurs", time: "09:00 – 17:00", spots: 2, type: "firstaid" },
  { date: "16.06.", day: "Mo", title: "Theorieunterricht", time: "18:00 – 20:00", spots: 8, type: "theory" },
  { date: "21.06.", day: "Sa", title: "Sehtest & Passbilder", time: "10:00 – 12:00", spots: 3, type: "eye" },
];

const typeColors: Record<string, string> = {
  theory: "bg-blue-100 text-blue-700",
  firstaid: "bg-red-100 text-red-700",
  eye: "bg-emerald-100 text-emerald-700",
  simulator: "bg-amber-100 text-amber-700",
};

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden pt-16">
        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-white/5" />
          <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-white/5" />
          <div className="absolute -bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-accent-500/10" />
          {/* Road stripes */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-accent-500/30" />
          <div className="absolute bottom-8 left-0 right-0 flex gap-16 px-8 opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-1 w-16 bg-white rounded-full" />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-1.5 text-sm font-medium text-accent-300 mb-6">
              <span className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
              Jetzt Plätze sichern – Sommer 2026
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Ihr Weg zum{" "}
              <span className="text-accent-400 relative">
                Führerschein
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 8" fill="none">
                  <path d="M1 6C50 2 250 2 299 6" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              Fahrschule Lohrmann – seit über 30 Jahren Ihr vertrauensvoller Partner. Kompetente Ausbildung, modernste Simulatoren und persönliche Betreuung bis zur bestandenen Prüfung.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/kurse" className="btn-primary text-base px-8 py-4 shadow-xl shadow-accent-900/30">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Kurs buchen
              </Link>
              <Link href="/simulator" className="btn-secondary text-base px-8 py-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Simulator buchen
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              {["TÜV-zertifiziert", "Ratenzahlung möglich", "Online-Theorie verfügbar"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 text-xs">
          <span>Mehr entdecken</span>
          <svg className="h-5 w-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100 ring-1 ring-slate-100 rounded-2xl overflow-hidden shadow-sm -mt-8 relative z-10 bg-white">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 px-6 text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary-800">{s.value}</span>
                <span className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ──────────────────────────────────────────── */}
      <section id="leistungen" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest">Leistungen</p>
            <h2 className="section-title mt-2">Alles aus einer Hand</h2>
            <p className="section-subtitle">
              Von der Theorie bis zur Prüfung – wir bieten Ihnen ein vollständiges Ausbildungspaket.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="card group flex flex-col hover:ring-primary-100"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${colorMap[s.color]} mb-4`}>
                  {s.icon}
                </div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-bold text-primary-800 text-lg">{s.title}</h3>
                    <span className="text-xs font-medium text-slate-400">{s.subtitle}</span>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-accent-600 bg-accent-50 px-2.5 py-1 rounded-full">
                    {s.price}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{s.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-800 transition-colors">
                  Mehr erfahren
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest">Ablauf</p>
            <h2 className="section-title mt-2">In 3 Schritten zum Führerschein</h2>
            <p className="section-subtitle">So einfach ist der Weg zu Ihrer Fahrerlaubnis.</p>
          </div>

          <div className="mt-16 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-1/2 -translate-x-1/2 w-2/3 h-px bg-slate-200" />

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              {steps.map((step, i) => (
                <div key={step.num} className="relative flex flex-col items-center text-center">
                  <div className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-extrabold shadow-lg ${
                    i === 1 ? "bg-accent-500 text-white" : "bg-primary-800 text-white"
                  }`}>
                    {step.num}
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-primary-800">{step.title}</h3>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link href="/kurse" className="btn-primary text-base px-10 py-4">
              Jetzt kostenlos anmelden
            </Link>
          </div>
        </div>
      </section>

      {/* ─── UPCOMING CLASSES PREVIEW ──────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest">Kurskalender</p>
              <h2 className="section-title mt-2">Nächste Kurstermine</h2>
            </div>
            <Link href="/kurse" className="btn-outline text-sm px-5 py-2.5 shrink-0">
              Alle Termine anzeigen
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {upcomingClasses.map((c) => (
              <div key={c.date + c.title} className="card p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-primary-50 shrink-0">
                    <span className="text-[10px] font-semibold text-primary-400 uppercase">{c.day}</span>
                    <span className="text-lg font-extrabold text-primary-800 leading-none">{c.date.split(".")[0]}</span>
                  </div>
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[c.type]}`}>
                      {c.type === "theory" ? "Theorie" : c.type === "firstaid" ? "Erste Hilfe" : c.type === "eye" ? "Sehtest" : "Simulator"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-primary-800 text-sm">{c.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.time} Uhr</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    <span className={`font-semibold ${c.spots <= 2 ? "text-red-500" : "text-emerald-600"}`}>{c.spots}</span> Plätze frei
                  </span>
                  <Link href="/kurse" className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                    Buchen →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SIMULATOR PROMO ───────────────────────────────────── */}
      <section className="py-24 bg-hero-gradient overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-10 h-[250px] w-[250px] rounded-full bg-accent-500/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent-400 font-semibold text-sm uppercase tracking-widest">Fahrsimulator</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
                Üben wie in der Realität –<br />
                <span className="text-accent-400">ohne Risiko</span>
              </h2>
              <p className="mt-5 text-slate-300 leading-relaxed">
                Unser hochmoderner Fahrsimulator bildet alle Verkehrssituationen detailgetreu ab. Üben Sie Autobahn, Regen, Nachtfahrten und kritische Manöver – in sicherer Umgebung. Ideal als Vorbereitung auf die praktische Prüfung.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Realistische Fahrsimulation mit 180° Panorama",
                  "Alle Verkehrs- und Wetterbedingungen",
                  "Sofortige Auswertung & Feedback",
                  "Online buchbar, sofortige Bezahlung",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="h-5 w-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0">
                      <svg className="h-3 w-3 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/simulator" className="btn-primary">
                  Jetzt Simulator buchen
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="flex items-center gap-2 text-white text-sm">
                  <span className="text-2xl font-extrabold text-accent-400">35 €</span>
                  <span className="text-slate-400">/ Stunde</span>
                </div>
              </div>
            </div>

            {/* Visual simulator card */}
            <div className="relative">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-slate-400 font-mono">simulator-booking.fl</span>
                </div>

                {/* Mock time slots grid */}
                <div className="space-y-3">
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Verfügbare Slots – Heute</p>
                  <div className="grid grid-cols-4 gap-2">
                    {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map((t, i) => (
                      <div
                        key={t}
                        className={`rounded-lg py-2 text-center text-xs font-semibold transition-all ${
                          [0, 3, 7, 9].includes(i)
                            ? "bg-slate-600/50 text-slate-500 cursor-not-allowed"
                            : i === 5
                            ? "bg-accent-500 text-white ring-2 ring-accent-300 shadow-lg"
                            : "bg-white/10 text-white hover:bg-accent-500/30 cursor-pointer"
                        }`}
                      >
                        {t}
                        {[0, 3, 7, 9].includes(i) && (
                          <div className="text-[9px] font-normal opacity-70">Belegt</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-white/10 inline-block" /> Frei</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-accent-500 inline-block" /> Ausgewählt</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-slate-600/50 inline-block" /> Belegt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────── */}
      <section id="ueber-uns" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest">Bewertungen</p>
            <h2 className="section-title mt-2">Das sagen unsere Schüler</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="h-5 w-5 text-accent-500 fill-accent-500" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-sm font-semibold text-primary-800 ml-1">4,9 / 5,0</span>
              <span className="text-sm text-slate-400">(127 Bewertungen)</span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-7 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-accent-500 fill-accent-500" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">"{t.text}"</p>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.age} Jahre</p>
                  </div>
                  <span className="text-xs bg-primary-50 text-primary-600 font-medium px-2.5 py-1 rounded-full">
                    {t.class}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-20 bg-accent-500">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Bereit für Ihren Führerschein?
          </h2>
          <p className="mt-4 text-lg text-amber-100 max-w-xl mx-auto">
            Starten Sie noch heute. Melden Sie sich kostenlos an und wir finden gemeinsam das beste Ausbildungspaket für Sie.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/kurse"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-bold text-amber-600 shadow-xl hover:bg-amber-50 transition-all hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Kurskalender öffnen
            </Link>
            <a
              href="tel:+491234567890"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-all"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0123 / 456 78 90
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
