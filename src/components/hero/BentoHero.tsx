import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { SITE } from '../../data/site'
import PortraitCard from './PortraitCard'
import IntroVideo from './IntroVideo'
import FloatingShape from './FloatingShape'
import { AskTile, CornerMark, ProjectTile, StatsTile } from './BentoTiles'
import helix from '../../assets/shapes/cut/helix.webp'
import icosahedron from '../../assets/shapes/cut/icosahedron.webp'

/*
 * Entrance on load (ms). The portrait card leads; tiles follow in reading order with gaps
 * that shrink (80, 70, 60, 50, 40) so the bento lands as one wave rather than a queue.
 *   portrait 0 · headline letters 80+ · video 150 · stats 210 · ask 260 · project 300
 *   shapes fade in last (decoration), stats count up once their tile has landed.
 */
const ORDER = { portrait: 0, headline: 80, video: 150, stats: 210, ask: 260, project: 300, shapes: 450 }

/** Fades a tile up on load. */
function Rise({ delay, className = '', children }: { delay: number; className?: string; children: ReactNode }) {
  const style: CSSProperties = { animationDelay: `${delay}ms` }
  return (
    <div className={`animate-rise ${className}`} style={style}>
      {children}
    </div>
  )
}

/** "Portfolio." with each letter blurring into focus, left to right. */
function Headline() {
  const reduceMotion = useReducedMotion()
  const word = 'Portfolio'
  return (
    <span aria-hidden="true" className="inline-flex">
      {[...word, '.'].map((char, i) => (
        <motion.span
          key={i}
          className={i === word.length ? 'text-accent' : undefined}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: '0.12em', filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : ORDER.headline / 1000 + i * 0.035 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

/**
 * Hero bento, following the reference layout:
 * portrait card (with a drifting mesh gradient) on the left; title, a wide video + stacked stats row,
 * then a small tile + wide split tile on the right. Two glossy shapes float over the seams.
 * On desktop the whole hero is capped to roughly one screen.
 */
function BentoHero() {
  return (
    <div className="relative grid gap-5 lg:h-[clamp(720px,calc(100svh-6rem),800px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Rise delay={ORDER.portrait} className="h-full min-h-0">
        <PortraitCard />
      </Rise>

      <div className="flex min-h-0 flex-col gap-5">
        <h1 className="relative flex items-start text-[clamp(52px,8vw,128px)] leading-[0.9] font-semibold tracking-normal lg:text-[clamp(64px,min(8vw,17vh),128px)]">
          <span className="sr-only">
            {SITE.firstName} {SITE.lastName}, {SITE.title}. I build RAG systems, AI engines and full-stack SaaS,
            and I measure them before I ship them.{' '}
          </span>
          <Headline />
          <Rise delay={ORDER.headline + 320}>
            <CornerMark weight={3.6} className="mt-[0.1em] ml-[0.04em] size-[0.2em] shrink-0" />
          </Rise>
        </h1>

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-5 lg:grid-rows-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Rise delay={ORDER.video} className="col-span-12 sm:col-span-8">
            <IntroVideo />
          </Rise>
          <Rise delay={ORDER.stats} className="col-span-12 sm:col-span-4">
            <StatsTile
              top={{ value: '90+', label: 'Tables in one database', delay: 0.5 }}
              bottom={{ value: '2', label: 'Platforms shipped', delay: 0.6 }}
            />
          </Rise>
          <Rise delay={ORDER.ask} className="col-span-12 sm:col-span-4">
            <AskTile />
          </Rise>
          <Rise delay={ORDER.project} className="col-span-12 sm:col-span-8">
            <ProjectTile />
          </Rise>
        </div>
      </div>

      {/* Decoration: fade in after the tiles, then float and drift against the mouse. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: ORDER.shapes / 1000 }}
      >
        {/* Helix off the end of the headline */}
        <FloatingShape src={helix} depth={22} className="top-[1%] right-[2%] size-16 lg:size-24" />
        {/* Crystal sitting on the seam between the portrait card and the tiles */}
        <FloatingShape src={icosahedron} depth={34} floatDelay={1.8} className="bottom-[30%] left-[39%] size-16 lg:size-20" />
      </motion.div>
    </div>
  )
}

export default BentoHero
