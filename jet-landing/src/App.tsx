import { useState } from 'react'
import { useLenis } from './hooks/useLenis'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Values from './components/Values'
import Fleet from './components/Fleet'
import Advantages from './components/Advantages'
import GlobalSection from './components/GlobalSection'
import Stats from './components/Stats'
import Footer from './components/Footer'
import BookingModal from './components/BookingModal'

export default function App() {
  useLenis()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="relative bg-black min-h-screen">
      <Nav onBook={() => setModalOpen(true)} />
      <Hero onBook={() => setModalOpen(true)} />
      <About />
      <Values />
      <Fleet />
      <Advantages />
      <GlobalSection />
      <Stats />
      <Footer onBook={() => setModalOpen(true)} />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
