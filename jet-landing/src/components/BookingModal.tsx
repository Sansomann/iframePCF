import { useEffect, useRef, useState } from 'react'
import { FLEET, BOOKING, BRAND } from '../content'

interface Props {
  open: boolean
  onClose: () => void
}

interface FormValues {
  name: string
  email: string
  phone: string
  arrival: string
  aircraft: string
  message: string
}

const EMPTY: FormValues = { name: '', email: '', phone: '', arrival: '', aircraft: '', message: '' }

export default function BookingModal({ open, onClose }: Props) {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormValues>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) { setStatus('idle'); setErrors({}) }
  }, [open])

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function validate(): boolean {
    const e: Partial<FormValues> = {}
    if (!values.name.trim()) e.name = 'Name is required'
    if (!values.email.trim() || !/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Valid email required'
    if (!values.phone.trim()) e.phone = 'Phone is required'
    if (!values.arrival.trim()) e.arrival = 'Arrival city is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')

    // TODO: wire BOOKING.formEndpoint to Formspree, Resend, or your own API
    // Example for Formspree:
    //   const res = await fetch(BOOKING.formEndpoint, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //     body: JSON.stringify(values),
    //   })
    //   if (!res.ok) { setStatus('error'); return }

    // Simulated success — remove this block once you wire the real endpoint
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('success')
  }

  function field(
    id: keyof FormValues,
    label: string,
    type = 'text',
    placeholder = '',
  ) {
    return (
      <div>
        <label htmlFor={id} className="micro-label block mb-2 text-cream-muted">
          {label}
        </label>
        <input
          id={id}
          type={type}
          autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
          placeholder={placeholder}
          value={values[id]}
          onChange={(ev) => setValues({ ...values, [id]: ev.target.value })}
          className={`w-full bg-surface border px-4 py-3 text-cream text-sm focus:outline-none focus:border-gold transition-colors ${
            errors[id] ? 'border-red-500/70' : 'border-white/10 hover:border-white/20'
          }`}
        />
        {errors[id] && <p className="text-red-400 text-xs mt-1">{errors[id]}</p>}
      </div>
    )
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Book a charter flight"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-xl bg-[#0f0f0f] border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-white/10">
          <div>
            <span className="micro-label block mb-2">{BRAND.name}</span>
            <h2 className="font-serif text-3xl text-cream font-light">{BOOKING.title}</h2>
            <p className="text-cream-muted text-xs mt-1">{BOOKING.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-cream-muted hover:text-cream transition-colors mt-1 ml-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {status === 'success' ? (
          <div className="px-8 py-16 text-center space-y-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto text-gold">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
              <polyline points="14,24 21,31 34,17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-serif text-2xl text-cream font-light">{BOOKING.successMessage}</p>
            <button onClick={onClose} className="btn-gold mt-4">
              <span>Close</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5" noValidate>
            <div className="grid sm:grid-cols-2 gap-5">
              {field('name', 'Full Name', 'text', 'Your name')}
              {field('email', 'Email Address', 'email', 'you@example.com')}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {field('phone', 'Phone Number', 'tel', '+1 000 000 0000')}
              {field('arrival', 'Arrival City', 'text', 'e.g. London, Dubai')}
            </div>

            {/* Aircraft select */}
            <div>
              <label htmlFor="aircraft" className="micro-label block mb-2 text-cream-muted">
                Preferred Aircraft
              </label>
              <select
                id="aircraft"
                value={values.aircraft}
                onChange={(e) => setValues({ ...values, aircraft: e.target.value })}
                className="w-full bg-surface border border-white/10 hover:border-white/20 px-4 py-3 text-cream text-sm focus:outline-none focus:border-gold transition-colors appearance-none"
              >
                <option value="">Select aircraft (optional)</option>
                {FLEET.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="micro-label block mb-2 text-cream-muted">
                Additional Notes
              </label>
              <textarea
                id="message"
                rows={3}
                value={values.message}
                onChange={(e) => setValues({ ...values, message: e.target.value })}
                placeholder="Departure details, dietary requirements, special requests…"
                className="w-full bg-surface border border-white/10 hover:border-white/20 px-4 py-3 text-cream text-sm focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-xs">Something went wrong. Please try again or contact us directly.</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-gold w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{status === 'sending' ? 'Sending…' : 'Submit Request'}</span>
            </button>

            <p className="text-cream-muted text-xs text-center">
              Or reach us directly at{' '}
              <a href={`mailto:${BRAND.email}`} className="text-gold hover:underline">{BRAND.email}</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
