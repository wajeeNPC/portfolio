import { useEffect } from 'react'
import { startLenis } from './lib/lenis'
import Gradient from './components/Gradient'
import Navbar from './components/Navbar'
import SideRail from './components/SideRail'
import Section from './components/Section'
import Hero from './components/hero/Hero'
import ProofStats from './components/hero/ProofStats'
import VideoReveal from './components/intro/VideoReveal'
import WorkFolders from './components/work/WorkFolders'
import WorkPanels from './components/work/WorkPanels'
import { LAB } from './data/lab'
import Bookshelf from './components/books/Bookshelf'
import ContactCard from './components/contact/ContactCard'
import Footer from './components/Footer'
import Skills from './components/Skills'
import { SmoothCursor } from './components/ui/smooth-cursor'

// The blurred backdrop gradient is kept in the system but hidden for the flat look. Flip to bring it back.
const SHOW_BACKDROP_GRADIENT = false

// Page width and side gutters (the side rail sits in the left gutter on desktop).
const PAGE = 'mx-auto w-full max-w-[1440px] px-5 md:pr-10 md:pl-24'

function App() {
  // Smooth, weighted scrolling for the whole page (skipped for reduced motion).
  useEffect(() => startLenis(), [])

  return (
    <>
      {SHOW_BACKDROP_GRADIENT && (
        <Gradient className="pointer-events-none fixed -top-[25%] -right-[15%] -z-10 h-[55vw] w-[55vw] opacity-100 transition-opacity duration-300 dark:opacity-40" />
      )}
      <SmoothCursor />
      <Navbar />
      <SideRail />

      <main>
        <div className={PAGE}>
          <section id="about" className="scroll-mt-24 pt-4 pb-16">
            <Hero />
          </section>
        </div>

        {/* Full-width: the giant "HELLO." that zooms into the intro video */}
        <VideoReveal />

        <div className={PAGE}>
          <section aria-label="Proof" className="py-16 md:py-24">
            <ProofStats />
          </section>

          <Section id="skills" title="Skills & technologies" intro="The stack I ship with, from model to database.">
            <Skills />
          </Section>

          <Section id="work" title="Selected work" intro="One flagship case study, two architecture stories, and what's next.">
            <WorkFolders />
          </Section>

          <Section id="lab" title="The lab" intro="What I'm learning in public right now.">
            <WorkPanels items={LAB} />
          </Section>

          <Section id="blog" title="On my shelf" intro="Books I'm reading and the ones that stuck with me.">
            <Bookshelf />
          </Section>

          <Section id="contact">
            <ContactCard />
          </Section>
        </div>
      </main>

      <Footer page={PAGE} />
    </>
  )
}

export default App
