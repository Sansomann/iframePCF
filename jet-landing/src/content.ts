// ─── Brand ──────────────────────────────────────────────────────────────────
export const BRAND = {
  name: 'AERONOVA',
  tagline: 'Private Aviation',
  phone: '+971 4 000 0000', // TODO: replace with real phone
  email: 'charter@aeronova.aero', // TODO: replace with real email
  base: 'Dubai, UAE', // TODO: replace if different
}

// ─── Navigation ─────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Fleet', href: '#fleet' },
  { label: 'Advantages', href: '#advantages' },
  { label: 'Global', href: '#global' },
]

// ─── Hero ────────────────────────────────────────────────────────────────────
export const HERO = {
  lines: ['We are movement.', 'We are distinction.', 'Your freedom to enjoy life.'],
  sub: 'Bespoke private aviation for those who refuse to compromise on time, comfort, or experience.',
  cta: 'Book the Flight',
  // TODO: replace these Unsplash URLs with your own high-res images
  bgImage: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&q=80',
  midImage: 'https://images.unsplash.com/photo-1612978964987-79f1f01fc073?w=1200&q=80',
  fgImage: 'https://images.unsplash.com/photo-1569154941061-e231b4aa8f47?w=800&q=80',
}

// ─── About ───────────────────────────────────────────────────────────────────
export const ABOUT = {
  label: 'Who We Are',
  paragraph:
    'Aeronova is a private aviation house born from the belief that travel should be extraordinary. We do not simply move people from place to place — we curate journeys. Every departure is deliberate, every arrival is considered, and every moment in between belongs entirely to you. With over 5,000 missions completed across 150 countries, we have earned the trust of discerning travellers, heads of state, and visionary business leaders who know that the journey is never secondary to the destination.',
  stats: [
    { value: 5000, suffix: '+', label: 'Missions Completed' },
    { value: 150, suffix: '+', label: 'Countries Reached' },
    { value: 24, suffix: '/7', label: 'Flight Support' },
    { value: 98, suffix: '%', label: 'On-Time Departure' },
  ],
}

// ─── Value Props ─────────────────────────────────────────────────────────────
export const VALUES = [
  {
    number: '01',
    title: 'Direct Access',
    body: 'Bypass commercial terminals entirely. We access 10× more airports than commercial airlines, putting you closer to your actual destination.',
    // TODO: replace with your own image
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70',
  },
  {
    number: '02',
    title: 'Your Freedom',
    body: 'Your schedule, your route, your rules. Depart when you are ready — not when an airline permits.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=70',
  },
  {
    number: '03',
    title: 'Precision & Excellence',
    body: 'Every detail is managed by a dedicated concierge team. From in-flight catering to ground transportation, nothing is left to chance.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=70',
  },
  {
    number: '04',
    title: 'Global Reach',
    body: 'An unmatched network of operators and handlers ensures that wherever you need to go, Aeronova gets you there.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=70',
  },
]

// ─── Fleet ───────────────────────────────────────────────────────────────────
export const FLEET: Array<{
  id: string
  name: string
  category: string
  description: string
  image: string
  blueprintImage: string
  specs: Array<{ label: string; value: string }>
}> = [
  {
    id: 'g650er',
    name: 'Gulfstream G650ER',
    category: 'Ultra Long Range',
    description:
      'The G650ER is the pinnacle of private aviation. With the longest range of any purpose-built business jet, she connects the world without compromise — in supreme comfort at transcontinental speeds.',
    // TODO: replace with your own aircraft image
    image: 'https://images.unsplash.com/photo-1559627096-8b515d4bdc0e?w=1400&q=80',
    // TODO: replace with your real cabin blueprint image
    blueprintImage: 'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=1000&q=70',
    specs: [
      { label: 'Range', value: '11,263 km' },
      { label: 'Speed', value: '480 kn' },
      { label: 'Passengers', value: 'Up to 12' },
      { label: 'Endurance', value: '14 hrs' },
      { label: 'Baggage', value: '5.52 m³' },
      { label: 'Cruising Altitude', value: '15,544 m' },
      { label: 'Cabin Length', value: '14.05 m' },
      { label: 'Cabin Width', value: '2.49 m' },
    ],
  },
  // TODO: add more aircraft here following the same shape
]

// ─── Advantages ──────────────────────────────────────────────────────────────
export const ADVANTAGES = [
  {
    title: 'Pets Welcome',
    body: 'Travel with your companions — no cargo holds, no separation. Your pets share the cabin in the comfort they deserve.',
    // TODO: replace with your own image
    image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=700&q=70',
  },
  {
    title: '24 / 7 Availability',
    body: 'Our operations centre never sleeps. Whether you need to depart in four hours or at dawn tomorrow, we make it happen.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=70',
  },
  {
    title: 'Onboard Services',
    body: 'Gourmet catering, premium spirits, curated entertainment, high-speed Wi-Fi, and a crew trained in five-star hospitality.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=70',
  },
  {
    title: 'Unmatched Efficiency',
    body: 'No queues. No connections. From doorstep to runway in minutes — reclaim the hours that commercial travel steals.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=70',
  },
]

// ─── Destinations ─────────────────────────────────────────────────────────────
export const DESTINATIONS = [
  'Dubai', 'London', 'New York', 'Tokyo', 'Geneva', 'Singapore', 'Paris',
  'Zurich', 'Monaco', 'Riyadh', 'Abu Dhabi', 'Hong Kong', 'Los Angeles',
  'Miami', 'Maldives', 'Cannes', 'Milan', 'Vienna', 'Doha', 'Bali',
  'Sydney', 'Cape Town', 'São Paulo', 'Toronto', 'Moscow', 'Istanbul',
  'Barcelona', 'Nairobi', 'Aspen', 'Santorini',
]

export const GLOBE_STATS = [
  { label: 'Countries Supported', value: 174 },
  { label: 'Active Operators', value: 320 },
]

// ─── Stats ────────────────────────────────────────────────────────────────────
export const STATS = {
  label: 'Trusted Worldwide',
  headline: '5,000+ flights successfully arranged',
  body: 'Every mission in our record represents a trust placed in Aeronova — and delivered upon without exception. Our obsession with reliability has made us the partner of choice for those for whom failure is simply not an option.',
}

// ─── Booking Modal ────────────────────────────────────────────────────────────
export const BOOKING = {
  title: 'Request a Charter',
  subtitle: 'Our team responds within two hours.',
  successMessage: 'Request received — our team will be in touch shortly.',
  // TODO: wire this endpoint to Formspree, Resend, or your own API
  formEndpoint: '', // e.g. 'https://formspree.io/f/YOUR_ID'
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER = {
  copy: `© ${new Date().getFullYear()} Aeronova Private Aviation. All rights reserved.`,
  links: [
    { label: 'Privacy Policy', href: '#' }, // TODO: link real privacy page
    { label: 'Terms of Service', href: '#' }, // TODO: link real terms page
  ],
}
