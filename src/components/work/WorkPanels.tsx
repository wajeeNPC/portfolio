import { motion, useReducedMotion, type Variants } from 'motion/react'
import { PROJECTS, type Project } from '../../data/projects'

// Cover images are optional: drop one in src/assets/projects/<slug>/cover.png and it shows up.
const covers = import.meta.glob<string>('../../assets/projects/*/cover.{png,webp,jpg}', {
  eager: true,
  import: 'default',
})
function coverFor(slug: string) {
  const key = Object.keys(covers).find((path) => path.includes(`/projects/${slug}/`))
  return key ? covers[key] : undefined
}

/**
 * Numbered colour panels, all the same width: picture on top, a short title and line of text,
 * and a giant number at the bottom.
 * Desktop: one row. Smaller screens: a sideways-swipe row.
 */
// Entrance: panels deal in from the left one after another. The gaps shrink so the row lands as one wave.
const DELAYS = [0, 0.11, 0.2, 0.27, 0.32]
const EASE_OUT = [0.22, 1, 0.36, 1] as const

function WorkPanels({ items = PROJECTS }: { items?: Project[] }) {
  const reduceMotion = useReducedMotion()

  const panel: Variants = {
    hidden: { opacity: 0, x: reduceMotion ? 0 : -48 },
    shown: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: reduceMotion ? 0.3 : 0.75, ease: EASE_OUT, delay: reduceMotion ? 0 : (DELAYS[i] ?? 0.32) },
    }),
  }

  return (
    // The whole row triggers once, so panels off to the side on phones still arrive with the rest
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {items.map((project, i) => (
        <Panel key={project.slug} project={project} number={i + 1} variants={panel} index={i} />
      ))}
    </motion.div>
  )
}

function Panel({
  project,
  number,
  variants,
  index,
}: {
  project: Project
  number: number
  variants: Variants
  index: number
}) {
  const { title, tagline, tone, icon: Icon, illustration } = project
  const cover = coverFor(project.slug)

  return (
    <motion.div
      variants={variants}
      custom={index}
      className="w-[64%] max-w-[260px] shrink-0 snap-start lg:w-auto lg:max-w-none"
    >
      <article
        aria-label={`${number}. ${title}`}
        className={`relative isolate flex h-[clamp(480px,68vh,600px)] flex-col overflow-hidden rounded-[10px] p-5 ${tone}`}
      >
        {/* Giant number, flush with the bottom-right edge */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[0.04em] -bottom-[0.14em] -z-10 text-[clamp(160px,14vw,230px)] leading-none font-semibold tracking-tighter text-white/90 select-none"
        >
          {number}
        </span>

        {/* Picture: cover image, else the illustration, else the icon */}
        <div className="mt-4 flex h-[56%] items-center justify-center">
          {cover ? (
            <img
              src={cover}
              alt=""
              loading="lazy"
              draggable={false}
              className="max-h-full w-full rounded-xl bg-background object-contain p-2 shadow-xl shadow-black/15"
            />
          ) : illustration ? (
            // Transparent PNGs with wide margins, so scale up a little to fill the space
            <img
              src={illustration}
              alt=""
              loading="lazy"
              draggable={false}
              className="size-full scale-125 object-contain"
            />
          ) : (
            <span className="grid size-20 place-items-center rounded-2xl bg-white/25">
              <Icon className="size-10" strokeWidth={1.6} aria-hidden="true" />
            </span>
          )}
        </div>
      </article>

      {/* Title and short description, under the card */}
      <h3 className="mt-4 px-1 font-montserrat text-xs font-bold tracking-wide uppercase">{title}</h3>
      <p className="mt-1.5 px-1 font-montserrat text-xs leading-relaxed text-muted">{tagline}</p>
    </motion.div>
  )
}

export default WorkPanels
