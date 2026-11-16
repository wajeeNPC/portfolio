import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight } from '../../icons'
import { SITE } from '../../data/site'
import Gradient from '../Gradient'
import FloatingShape from './FloatingShape'
import ShimmerButton from '../ui/shimmer-button'
import Doodle from '../ui/doodle'
import thought from '../../assets/doodles/thoughts, dreams, clouds, thought bubble, 11.png'
import sparkles from '../../assets/doodles/spark, sparks, sparkle, stars, 30.png'
import wave from '../../assets/doodles/beach, wave, doodle, water, sea, ocean, 2.png'
import dots from '../../assets/doodles/snow, rain, drops, weather, sparkle, pattern.png'
import curlyArrow from '../../assets/doodles/arrow, hand drawn, scribble, doodle, down, curvy, curly, down, right, 71.png'
import developer from '../../assets/illustrations/hero-developer.svg'
import torus from '../../assets/shapes/cut/torus.webp'
import helix from '../../assets/shapes/cut/helix.webp'
import icosahedron from '../../assets/shapes/cut/icosahedron.webp'
import linkedin from '../../assets/icons/linkedin.svg'
import github from '../../assets/icons/github.svg'
import gmail from '../../assets/icons/gmail.svg'
import whatsapp from '../../assets/icons/whatsapp.svg'

const ROLE = SITE.title
const INTRO =
  'From the first line of code to the last pixel, I build full-stack platforms and intelligent systems that solve real problems, not just demos.'

const SOCIALS = [
  { label: 'LinkedIn', href: SITE.socials.linkedin, icon: linkedin },
  { label: 'GitHub', href: SITE.socials.github, icon: github },
  { label: 'Email', href: `mailto:${SITE.email}`, icon: gmail },
  { label: 'WhatsApp', href: SITE.socials.whatsapp, icon: whatsapp },
]

/*
 * Entrance on load (seconds). The name leads; the rest of the text follows in reading order
 * with shrinking gaps so it lands as one wave. The scene builds behind it: torus, then the
 * developer, then the small shapes (decoration, fade only).
 *   greeting 0 · name letters .08+ · role .38 · intro .46 · actions .53 · socials .59
 *   torus .15 · developer .35 · shapes .7
 *   doodles (decoration) .85 → 1.07, shrinking gaps; the arrow by the button lands with the actions
 */
const EASE = [0.22, 1, 0.36, 1] as const

function useEnter(delay: number, distance = 14) {
  const reduceMotion = useReducedMotion()
  return {
    initial: { opacity: 0, y: reduceMotion ? 0 : distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay: reduceMotion ? 0 : delay },
  }
}

/**
 * "Shayeed" on the first line, "Wajee." on the second; each word stays whole.
 * Each letter blurs into focus, left to right, carrying on across both lines.
 */
function Name() {
  const reduceMotion = useReducedMotion()
  const lines = [[...SITE.firstName], [...SITE.lastName, '.']]
  let index = 0 // letter count across both lines, for the stagger
  return (
    <h1 className="text-[clamp(44px,6.4vw,96px)] leading-[1.02] font-normal tracking-tight">
      <span className="sr-only">
        {SITE.firstName} {SITE.lastName}, {ROLE}
      </span>
      {lines.map((chars, line) => (
        <span key={line} aria-hidden="true" className="block whitespace-nowrap">
          {chars.map((char, i) => {
            const delay = 0.08 + index++ * 0.025
            const isDot = line === 1 && i === chars.length - 1
            return (
              <motion.span
                key={i}
                className={`inline-block ${isDot ? 'text-accent' : ''}`}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: '0.15em', filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: EASE, delay: reduceMotion ? 0 : delay }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

/**
 * The illustration from the Figma frame: the developer sits on a glossy torus, a helix floats
 * top-right and a crystal hovers off to the left. Positions are percentages of one square
 * scene measured from the frame, so it all scales together.
 */
function Scene({ shown }: { shown: boolean }) {
  const reduceMotion = useReducedMotion()
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[640px]">
      <motion.div
        className="absolute top-[31%] left-[17%] w-[77%]"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: reduceMotion ? 0 : 0.15 }}
      >
        <FloatingShape src={torus} depth={10} className="relative inset-auto z-0 aspect-[1.16] w-full" />
      </motion.div>

      <motion.img
        src={developer}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute top-0 left-0 z-10 w-[86%] select-none dark:invert dark:hue-rotate-180"
        {...useEnter(0.35, 18)}
      />

      <motion.div
        className="absolute inset-0 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.7 }}
      >
        <FloatingShape src={helix} depth={26} floatDelay={0.9} className="top-[11%] left-[86%] w-[12.5%]" />
        <FloatingShape src={icosahedron} depth={34} floatDelay={2.2} className="top-[68%] -left-[12%] w-[15%]" />
      </motion.div>

      {/* Hand-drawn doodles in the scene's empty corners (see src/assets/doodles) */}
      <div className="absolute inset-0 z-30">
        {/* The developer is thinking in code: a thought bubble trailing to his head */}
        <Doodle src={thought} shown={shown} delay={0.85} flip className="top-[1%] left-[3%] w-[24%] text-ink">
          <span className="absolute top-[24%] right-[18%] left-[4%] text-center text-[clamp(14px,2vw,26px)] font-bold text-accent">
            {'</>'}
          </span>
        </Doodle>
        {/* Sparkles over the monitor */}
        <Doodle src={sparkles} shown={shown} delay={0.95} float className="top-[1%] left-[60%] w-[12%] text-accent" />
        {/* A wave under the crystal, bottom-left */}
        <Doodle src={wave} shown={shown} delay={1.02} rotate={-6} className="top-[84%] left-[2%] w-[18%] text-ink/70" />
        {/* Dots by the ring, bottom-right */}
        <Doodle src={dots} shown={shown} delay={1.07} className="top-[78%] left-[86%] w-[12%] text-ink/35" />
      </div>
    </div>
  )
}

/** Hero from the Figma frame: greeting, name, role, intro, actions and socials; the illustrated scene on the right. */
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  // Doodles pop in once the hero is on screen (it is, on load)
  const shown = useInView(ref, { once: true })
  return (
    <div
      ref={ref}
      className="relative grid items-center gap-12 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-6"
    >
      {/* Pink/amber glow behind the scene, top-right, like the frame */}
      <Gradient className="pointer-events-none absolute -top-[30%] -right-[25%] -z-10 aspect-square w-[min(80vw,900px)] opacity-90 dark:opacity-40" />

      <div className="max-w-xl">
        <motion.p className="text-[clamp(26px,2.6vw,40px)] font-light text-muted" {...useEnter(0)}>
          Hi, I am
        </motion.p>
        <Name />
        <motion.p className="mt-3 font-montserrat text-base text-muted italic sm:text-right sm:text-lg" {...useEnter(0.38, 8)}>
          {ROLE}
        </motion.p>

        <motion.p
          className="mt-10 max-w-lg font-montserrat text-base leading-relaxed text-muted sm:text-lg"
          {...useEnter(0.46, 10)}
        >
          {INTRO}
        </motion.p>

        <motion.div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" {...useEnter(0.53, 10)}>
          <ShimmerButton
            href="#work"
            background="#1a1a1a"
            shimmerColor="#ff7bca"
            shimmerDuration="3s"
            className="min-h-11 gap-2 py-0 font-montserrat text-sm font-semibold"
          >
            See My Work
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </ShimmerButton>
          {/* A curly arrow pointing back at the button */}
          <Doodle
            src={curlyArrow}
            shown={shown}
            delay={0.7}
            flip
            className="relative -mt-8 -ml-4 hidden w-14 text-ink sm:block"
          />
        </motion.div>

        <motion.div className="mt-12" {...useEnter(0.59, 10)}>
          <p className="font-semibold">
            Socials<span className="text-accent">.</span>
          </p>
          <ul className="mt-3 flex items-center gap-2">
            {SOCIALS.map(({ label, href, icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-xl transition-colors hover:bg-ink/5"
                >
                  <img src={icon} alt="" className={`size-7 ${label === 'GitHub' ? 'dark:invert' : ''}`} />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <Scene shown={shown} />
    </div>
  )
}

export default Hero
