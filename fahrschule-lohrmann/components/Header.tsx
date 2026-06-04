"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Start" },
  { href: "/kurse", label: "Kurse" },
  { href: "/simulator", label: "Simulator" },
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#ueber-uns", label: "Über uns" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-primary-800 shadow-xl" : "bg-primary-800/95 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-white font-bold text-lg shadow-md group-hover:bg-accent-400 transition-colors">
              FL
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-lg leading-none">Fahrschule</span>
              <span className="block text-accent-400 font-semibold text-sm leading-none tracking-wide">
                LOHRMANN
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/kurse"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-accent-600 transition-all hover:-translate-y-0.5"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Jetzt buchen
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Menü öffnen"
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-3 pb-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/kurse"
                onClick={() => setMobileOpen(false)}
                className="mt-2 mx-0 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
              >
                Jetzt buchen
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
