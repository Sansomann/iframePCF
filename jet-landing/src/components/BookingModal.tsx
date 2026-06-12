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
  from: string
  to: string
  date: string
  pax: string
  aircraft: string
  notes: string
}

const EMPTY: FormValues = {
  name: '', email: '', phone: '', from: '', to: '',
  date: '', pax: '1', aircraft: '', notes: '',
}

export default function BookingModal({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Trap focus inside modal
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    firstInputRef.current?.focus()

    const focusable = panel.querySelectorAll<HTMLElement>(
      'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setSubmitted(false)
      setError('')
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (BOOKING.formEndpoint) {
        const res = await fetch(BOOKING.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        })
        if (!res.ok) throw new Error('Submission failed')
      } else {
        // Dev mode — no endpoint configured, just simulate
        await new Promise((r) => setTimeout(r, 800))
      }
      setSubmitted(true)
      setValues(EMPTY)
    } catch {
      setError('Something went wrong. Please try calling us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const inputClass =
    'w-full bg-transparent border-b border-white/20 text-cream text-sm py-3 px-0 focus:outline-none focus:border-gold placeholder-cream-muted/50 transition-colors'
  const labelClass = 'micro-label block mb-2'

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full sm:max-w-2xl bg-surface border border-white/10 max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <div>
            <h2 id="modal-title" className="font-serif text-2xl text-cream font-light">
              {BOOKING.title}
            </h2>
            <p className="text-cream-muted text-xs mt-1">{BOOKING.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-cream-muted hover:text-cream transition-colors p-2"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          {submitted ? (
            <div className="text-center py-12">
              <span className="gold-rule mx-auto mb-6" />
              <p className="font-serif text-2xl text-cream font-light mb-4">{BOOKING.successMessage}</p>
              <p className="text-cream-muted text-sm">
                Alternatively, reach us directly at{' '}
                <a href={`tel:${BRAND.phone}`} className="text-gold hover:underline">{BRAND.phone}</a>
              </p>
              <button onClick={onClose} className="btn-gold mt-8">
                <span>Close</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Row 1 */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={labelClass}>Full Name *</label>
                  <input
                    ref={firstInputRef}
                    id="name" name="name" type="text" required
                    value={values.name} onChange={handleChange}
                    className={inputClass} placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email *</label>
                  <input
                    id="email" name="email" type="email" required
                    value={values.email} onChange={handleChange}
                    className={inputClass} placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone</label>
                  <input
                    id="phone" name="phone" type="tel"
                    value={values.phone} onChange={handleChange}
                    className={inputClass} placeholder="+1 555 000 0000"
                  />
                </div>
                <div>
                  <label htmlFor="date" className={labelClass}>Departure Date *</label>
                  <input
                    id="date" name="date" type="date" required
                    value={values.date} onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="from" className={labelClass}>From *</label>
                  <input
                    id="from" name="from" type="text" required
                    value={values.from} onChange={handleChange}
                    className={inputClass} placeholder="Departure city / airport"
                  />
                </div>
                <div>
                  <label htmlFor="to" className={labelClass}>To *</label>
                  <input
                    id="to" name="to" type="text" required
                    value={values.to} onChange={handleChange}
                    className={inputClass} placeholder="Destination city / airport"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="pax" className={labelClass}>Passengers *</label>
                  <input
                    id="pax" name="pax" type="number" min="1" max="20" required
                    value={values.pax} onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="aircraft" className={labelClass}>Preferred Aircraft</label>
                  <select
                    id="aircraft" name="aircraft"
                    value={values.aircraft} onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">Any / Advise me</option>
                    {FLEET.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className={labelClass}>Special Requests</label>
                <textarea
                  id="notes" name="notes" rows={3}
                  value={values.notes} onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  placeholder="Catering preferences, onward ground transport, pets…"
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <p className="text-cream-muted text-xs">* Required fields</p>
                <button type="submit" disabled={loading} className="btn-gold disabled:opacity-50">
                  <span>{loading ? 'Sending…' : 'Send Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
