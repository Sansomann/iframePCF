"use client";

import { useState } from "react";
import Link from "next/link";

const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const DAY_NAMES_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const PRICE_PER_HOUR = 35;

// Occupied slots per day key
const OCCUPIED: Record<string, string[]> = {
  "2026-6-4":  ["09:00", "10:00", "14:00"],
  "2026-6-5":  ["08:00", "11:00", "15:00", "16:00"],
  "2026-6-6":  ["09:00", "13:00"],
  "2026-6-9":  ["10:00", "11:00", "16:00", "17:00"],
  "2026-6-10": ["08:00", "14:00"],
  "2026-6-11": ["09:00", "15:00", "18:00"],
  "2026-6-12": ["10:00", "11:00", "12:00"],
  "2026-6-16": ["09:00", "16:00"],
  "2026-6-17": ["11:00", "14:00", "15:00"],
  "2026-6-18": ["10:00", "13:00", "17:00"],
  "2026-6-23": ["09:00", "10:00"],
  "2026-6-25": ["14:00", "18:00"],
};

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

function getCalendarDays(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rawFirst = new Date(year, month, 1).getDay();
  const startDay = (rawFirst + 6) % 7;

  const days: { day: number; month: number; year: number; current: boolean }[] = [];
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear  = month === 0 ? year - 1 : year;
  const daysInPrev = new Date(prevYear, prevMonth + 1, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrev - i, month: prevMonth, year: prevYear, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, month, year, current: true });
  }
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear  = month === 11 ? year + 1 : year;
  while (days.length < 42) {
    days.push({ day: days.length - startDay - daysInMonth + 1, month: nextMonth, year: nextYear, current: false });
  }
  return days;
}

function formatCard(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
}

export default function SimulatorPage() {
  const today = new Date();
  const [year, setYear]           = useState(today.getFullYear());
  const [month, setMonth]         = useState(today.getMonth());
  const [selectedDay, setDay]     = useState<string | null>(null);
  const [selectedSlot, setSlot]   = useState<string | null>(null);
  const [payStep, setPayStep]     = useState<"form" | "payment" | "success">("form");

  const [form, setForm] = useState({ name: "", email: "", phone: "", klasse: "B", notes: "" });
  const [card, setCard] = useState({ holder: "", number: "", expiry: "", cvc: "" });

  const days = getCalendarDays(year, month);
  const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const occupiedForDay = selectedDay ? (OCCUPIED[selectedDay] ?? []) : [];
  const isWeekend = (idx: number) => idx % 7 >= 5;

  const selectedDayLabel = (() => {
    if (!selectedDay) return null;
    const [y, m, d] = selectedDay.split("-").map(Number);
    return `${d}. ${MONTH_NAMES[m - 1]} ${y}`;
  })();

  const totalPrice = selectedSlot ? PRICE_PER_HOUR : 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Page Header */}
      <div className="bg-primary-800 text-white py-14 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Start</Link>
            <span>›</span>
            <span className="text-white">Simulator buchen</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Fahrsimulator buchen</h1>
          <p className="mt-2 text-slate-300 text-lg max-w-xl">
            Wählen Sie Ihren Wunschtermin und bezahlen Sie sicher online. Sofortbestätigung per E-Mail.
          </p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm">
            {[
              { icon: "⚡", text: "Sofortbestätigung" },
              { icon: "🔒", text: "Sichere Zahlung (SSL)" },
              { icon: "↩", text: "Kostenlose Stornierung bis 24h vorher" },
            ].map((b) => (
              <span key={b.text} className="flex items-center gap-2 text-slate-300">
                <span>{b.icon}</span> {b.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {payStep === "success" ? (
        /* ── Success Screen ── */
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
              <svg className="h-10 w-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-primary-800">Buchung bestätigt!</h2>
            <p className="mt-3 text-slate-500">
              Ihre Simulator-Stunde am <strong>{selectedDayLabel}</strong> um <strong>{selectedSlot} Uhr</strong> wurde erfolgreich gebucht.
            </p>
            <div className="mt-6 rounded-2xl bg-white ring-1 ring-slate-100 p-5 text-sm text-left space-y-2 shadow-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Buchungs-Nr.</span>
                <span className="font-mono font-semibold text-primary-800">FL-{Math.floor(Math.random() * 90000 + 10000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Datum</span>
                <span className="font-semibold text-primary-800">{selectedDayLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Uhrzeit</span>
                <span className="font-semibold text-primary-800">{selectedSlot} – {selectedSlot ? String(parseInt(selectedSlot) + 1).padStart(2, "0") + ":00" : ""} Uhr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Teilnehmer</span>
                <span className="font-semibold text-primary-800">{form.name}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between">
                <span className="font-semibold">Bezahlt</span>
                <span className="font-bold text-emerald-600">{totalPrice} €</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">Bestätigung wurde an <strong>{form.email}</strong> gesendet.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn-outline">Zur Startseite</Link>
              <button
                onClick={() => { setPayStep("form"); setSlot(null); setDay(null); }}
                className="btn-primary"
              >
                Weiteren Termin buchen
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Calendar + Time Slots ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Mini Calendar */}
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <button onClick={prevMonth} className="rounded-lg p-2 hover:bg-slate-100 transition-colors">
                    <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-base font-bold text-primary-800">{MONTH_NAMES[month]} {year}</h2>
                  <button onClick={nextMonth} className="rounded-lg p-2 hover:bg-slate-100 transition-colors">
                    <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7">
                  {DAY_NAMES_SHORT.map((d, i) => (
                    <div key={d} className={`py-2 text-center text-[11px] font-semibold uppercase tracking-wider ${i >= 5 ? "text-red-400" : "text-slate-400"}`}>{d}</div>
                  ))}
                  {days.map((d, idx) => {
                    const key = `${d.year}-${d.month + 1}-${d.day}`;
                    const isToday = key === todayKey;
                    const isSel = key === selectedDay;
                    const weekend = isWeekend(idx);
                    const hasOccupied = (OCCUPIED[key] ?? []).length > 0;
                    const freeSlots = 12 - (OCCUPIED[key] ?? []).length;
                    const isPast = d.current && new Date(d.year, d.month, d.day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (!d.current || isPast || weekend) return;
                          setDay(isSel ? null : key);
                          setSlot(null);
                        }}
                        className={`relative border-r border-b border-slate-100 p-1 h-16 flex flex-col items-center pt-1.5 transition-all ${
                          !d.current || isPast || weekend ? "opacity-30 cursor-default" : "cursor-pointer hover:bg-primary-50"
                        } ${isSel ? "bg-primary-50 ring-inset ring-2 ring-primary-400" : ""}`}
                      >
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                            isToday ? "bg-accent-500 text-white" : "text-slate-700"
                          }`}
                        >
                          {d.day}
                        </span>
                        {d.current && !isPast && !weekend && hasOccupied && (
                          <span className="mt-1 text-[8px] text-emerald-600 font-semibold">{freeSlots} frei</span>
                        )}
                        {d.current && !isPast && !weekend && !hasOccupied && (
                          <span className="mt-1 text-[8px] text-emerald-600 font-semibold">12 frei</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Grid */}
              {selectedDay && (
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-5 animate-fade-in">
                  <h3 className="font-bold text-primary-800 mb-1">
                    Verfügbare Zeiten – {selectedDayLabel}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Wählen Sie Ihren Wunschtermin (je 60 Minuten)</p>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((t) => {
                      const occupied = occupiedForDay.includes(t);
                      const selected = selectedSlot === t;
                      return (
                        <button
                          key={t}
                          disabled={occupied}
                          onClick={() => setSlot(selected ? null : t)}
                          className={`rounded-xl py-3 text-sm font-semibold transition-all ${
                            occupied
                              ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                              : selected
                              ? "bg-accent-500 text-white ring-2 ring-accent-300 shadow-lg shadow-amber-100 scale-105"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:scale-105"
                          }`}
                        >
                          {t}
                          <div className="text-[9px] font-normal mt-0.5 opacity-75">
                            {occupied ? "Belegt" : selected ? "Gewählt" : "Frei"}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center gap-5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-50 ring-1 ring-emerald-100 inline-block" /> Verfügbar</span>
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent-500 inline-block" /> Ausgewählt</span>
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-100 inline-block" /> Belegt</span>
                  </div>
                </div>
              )}

              {!selectedDay && (
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-8 flex flex-col items-center justify-center text-center text-slate-300">
                  <svg className="h-14 w-14 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-400 font-medium">Wählen Sie zuerst einen Tag im Kalender</p>
                  <p className="text-sm text-slate-300 mt-1">Wochentage Mo–Fr sind buchbar</p>
                </div>
              )}
            </div>

            {/* ── Right: Booking + Payment ── */}
            <div className="space-y-5">
              {/* Booking Summary */}
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
                <div className="bg-primary-800 px-5 py-4">
                  <h3 className="font-bold text-white text-sm">Buchungsübersicht</h3>
                </div>
                <div className="p-5 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Service</span>
                    <span className="font-semibold text-primary-800">Fahrsimulator (60 min)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Datum</span>
                    <span className={`font-semibold ${selectedDay ? "text-primary-800" : "text-slate-300"}`}>
                      {selectedDayLabel ?? "– nicht gewählt –"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Uhrzeit</span>
                    <span className={`font-semibold ${selectedSlot ? "text-primary-800" : "text-slate-300"}`}>
                      {selectedSlot ? `${selectedSlot} – ${String(parseInt(selectedSlot) + 1).padStart(2, "0")}:00 Uhr` : "– nicht gewählt –"}
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                    <span className="font-bold text-slate-700">Gesamtbetrag</span>
                    <span className={`text-xl font-extrabold ${selectedSlot ? "text-accent-600" : "text-slate-300"}`}>
                      {selectedSlot ? `${totalPrice} €` : "–"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Steps indicator */}
              <div className="flex items-center gap-3 text-xs font-semibold">
                {[
                  { num: 1, label: "Angaben", active: payStep === "form" },
                  { num: 2, label: "Zahlung", active: payStep === "payment" },
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2 flex-1">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                      s.active ? "bg-primary-800 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      {s.num}
                    </div>
                    <span className={s.active ? "text-primary-800" : "text-slate-400"}>{s.label}</span>
                    {i < 1 && <div className="flex-1 h-px bg-slate-200" />}
                  </div>
                ))}
              </div>

              {payStep === "form" && (
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-5 space-y-4">
                  <h3 className="font-bold text-primary-800">Ihre Angaben</h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Vollständiger Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Max Mustermann"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">E-Mail *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="max@beispiel.de"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0123 456789"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Führerscheinklasse</label>
                    <select
                      value={form.klasse}
                      onChange={(e) => setForm({ ...form, klasse: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition bg-white"
                    >
                      {["B", "A", "A2", "AM", "BE", "L"].map((k) => (
                        <option key={k} value={k}>Klasse {k}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Anmerkungen (optional)</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="z.B. besondere Wünsche, Fahranfänger..."
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition resize-none"
                    />
                  </div>

                  <button
                    onClick={() => setPayStep("payment")}
                    disabled={!selectedDay || !selectedSlot || !form.name || !form.email}
                    className="w-full rounded-xl bg-primary-800 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    Weiter zur Zahlung →
                  </button>

                  {(!selectedDay || !selectedSlot) && (
                    <p className="text-xs text-center text-slate-400">
                      Bitte wählen Sie zuerst einen Termin im Kalender
                    </p>
                  )}
                </div>
              )}

              {payStep === "payment" && (
                <div className="space-y-4 animate-fade-in">
                  {/* Credit Card Visual */}
                  <div className="credit-card">
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Fahrschule Lohrmann</p>
                        <p className="text-sm font-bold text-white/90 mt-0.5">Simulator Buchung</p>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-6 w-6 rounded-full bg-red-400/80" />
                        <div className="h-6 w-6 rounded-full bg-amber-400/80 -ml-2" />
                      </div>
                    </div>
                    <div className="font-mono text-xl font-bold tracking-widest text-white/90 relative z-10 mb-5">
                      {card.number || "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest">Karteninhaber</p>
                        <p className="text-sm font-semibold text-white/90">{card.holder || "–"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest">Gültig bis</p>
                        <p className="text-sm font-semibold text-white/90">{card.expiry || "MM/JJ"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-white/40 uppercase tracking-widest">Betrag</p>
                        <p className="text-sm font-bold text-accent-400">{totalPrice} €</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-5 space-y-4">
                    <h3 className="font-bold text-primary-800 flex items-center gap-2">
                      <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Sichere Zahlung
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Karteninhaber</label>
                      <input
                        type="text"
                        value={card.holder}
                        onChange={(e) => setCard({ ...card, holder: e.target.value })}
                        placeholder="Max Mustermann"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Kartennummer</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={card.number}
                          onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-12 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <div className="h-4 w-4 rounded-full bg-red-400" />
                          <div className="h-4 w-4 rounded-full bg-amber-400 -ml-2" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Ablaufdatum</label>
                        <input
                          type="text"
                          value={card.expiry}
                          onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                          placeholder="MM/JJ"
                          maxLength={5}
                          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">CVC</label>
                        <input
                          type="text"
                          value={card.cvc}
                          onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          placeholder="• • •"
                          maxLength={4}
                          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fahrsimulator (60 Min)</span>
                        <span className="font-semibold">{PRICE_PER_HOUR},00 €</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>inkl. 19% MwSt.</span>
                        <span>{(PRICE_PER_HOUR * 0.19).toFixed(2)} €</span>
                      </div>
                      <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-bold">
                        <span>Gesamt</span>
                        <span className="text-accent-600 text-base">{PRICE_PER_HOUR},00 €</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setPayStep("form")}
                        className="flex-1 rounded-xl border-2 border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300 transition"
                      >
                        ← Zurück
                      </button>
                      <button
                        onClick={() => setPayStep("success")}
                        disabled={!card.holder || card.number.length < 19 || card.expiry.length < 5 || card.cvc.length < 3}
                        className="flex-2 flex-grow rounded-xl bg-accent-500 py-3 text-sm font-bold text-white transition-all hover:bg-accent-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-200"
                      >
                        🔒 Jetzt {totalPrice} € bezahlen
                      </button>
                    </div>

                    <p className="text-center text-[10px] text-slate-400">
                      Ihre Zahlungsdaten werden SSL-verschlüsselt übertragen. Wir speichern keine Kartendaten.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
