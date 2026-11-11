import { createRef, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { AnimatedBeam } from '../ui/animated-beam'
import { FLOWS, LAYERS, SKILL, type SkillId } from '../../data/skills'
import { cn } from '../../lib/utils'
import SkillLogo from './SkillLogo'

// Columns, left to right. Models and data share the last column.
const COLUMNS = [['frontend'], ['api'], ['ai'], ['models', 'data']].map((ids) => ids.map((id) => LAYERS.find((l) => l.id === id)!))
const SHIPS_WITH = LAYERS.find((l) => l.id === 'ship')!

/*
 * Entrance, when the diagram scrolls into view (seconds). The diagram builds in the same
 * direction a request travels, so the order means something:
 *   columns     0 / .11 / .20 / .27   fade + 10px slide from the left, gaps shrinking so it reads as one wave
 *   nodes       +.04 each within a column
 *   labels      fade only, with their column
 *   tracks      faint beam lines fade in as their destination column lands
 *   ships-with  fade only at .30
 *   light       first pulse at .9, once everything has settled, then loops column by column
 * Reduced motion: everything fades in together, no slide, no travelling light.
 */
const COLUMN_START = [0, 0.11, 0.2, 0.27]
const NODE_STEP = 0.04
const ENTER = { duration: 0.45, ease: [0.22, 1, 0.36, 1] } as const
const PULSE_START = 0.9

// Light leaves each column in turn, so it appears to travel through the stack.
const STEP = 1.1
const BEAM_DURATION = 2.2
const COLUMN_OF = Object.fromEntries(COLUMNS.flatMap((col, i) => col.flatMap((l) => l.skills.map((s) => [s, i])))) as Record<
  SkillId,
  number
>

type Activate = (id: SkillId | null) => void

function Node({
  id,
  nodeRef,
  active,
  dimmed,
  onActivate,
}: {
  id: SkillId
  nodeRef?: RefObject<HTMLDivElement | null>
  active: boolean
  dimmed: boolean
  onActivate: Activate
}) {
  const skill = SKILL[id]
  return (
    <div
      ref={nodeRef}
      // Mouse: hover. Touch: tap to select, tap again to clear.
      onPointerEnter={(e) => e.pointerType === 'mouse' && onActivate(id)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && onActivate(null)}
      onClick={() => onActivate(active ? null : id)}
      className={cn(
        'relative flex cursor-default items-center gap-3 rounded-2xl border border-line bg-background py-2.5 pr-4 pl-3 shadow-sm shadow-black/[0.03] transition-[opacity,border-color] duration-300 lg:w-full',
        active && 'border-accent/50',
        dimmed && 'opacity-35',
      )}
    >
      <SkillLogo skill={skill} className="size-7 shrink-0" />
      <span className="font-montserrat text-sm font-semibold whitespace-nowrap">{skill.name}</span>

      {/* Small dark card above the node listing where the skill was used. */}
      <AnimatePresence>
        {active && skill.usedIn && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 origin-bottom -translate-x-1/2"
          >
            <div className="rounded-xl bg-ink px-3 py-2 text-background shadow-lg shadow-black/15">
              <p className="font-montserrat text-[10px] font-semibold tracking-[0.14em] uppercase opacity-60">Used in</p>
              <ul className="mt-1 flex flex-col gap-0.5">
                {skill.usedIn.map((project) => (
                  <li key={project} className="flex items-center gap-1.5 font-montserrat text-xs font-semibold whitespace-nowrap">
                    <span className="size-1.5 rounded-full bg-accent" />
                    {project}
                  </li>
                ))}
              </ul>
            </div>
            {/* Arrow */}
            <span className="absolute top-full left-1/2 -mt-1 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-ink" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Fades (and, with motion allowed, slides) a piece of the diagram in once it's in view. */
function Enter({
  shown,
  delay,
  slide = true,
  className,
  children,
}: {
  shown: boolean
  delay: number
  slide?: boolean
  className?: string
  children: ReactNode
}) {
  const reduceMotion = useReducedMotion()
  const move = slide && !reduceMotion
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: move ? -10 : 0 }}
      animate={shown ? { opacity: 1, x: 0 } : undefined}
      transition={{ ...ENTER, delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  )
}

/** The stack drawn as a working system: requests flow as light from frontend to models and data. */
function SkillsDiagram() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shown = useInView(containerRef, { once: true, amount: 0.25 })
  const reduceMotion = useReducedMotion()
  const refs = useMemo(
    () => Object.fromEntries(Object.keys(SKILL).map((id) => [id, createRef<HTMLDivElement>()])) as Record<SkillId, RefObject<HTMLDivElement | null>>,
    [],
  )
  const [active, setActive] = useState<SkillId | null>(null)

  // While a skill is selected, keep it and everything wired to it lit; fade the rest.
  const linked = useMemo(() => {
    if (!active) return null
    const ids = new Set<SkillId>([active])
    for (const [a, b] of FLOWS) if (a === active || b === active) ids.add(a === active ? b : a)
    return ids
  }, [active])

  const node = (id: SkillId, delay: number, withRef: boolean) => (
    <Enter key={id} shown={shown} delay={delay} className={cn('relative', active === id ? 'z-30' : 'z-10')}>
      <Node
        id={id}
        nodeRef={withRef ? refs[id] : undefined}
        active={active === id}
        dimmed={!!linked && !linked.has(id)}
        onActivate={setActive}
      />
    </Enter>
  )

  return (
    <div>
      <div ref={containerRef} className="relative text-ink">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:items-center lg:gap-x-16 xl:gap-x-24">
          {COLUMNS.map((layers, col) => {
            let index = 0 // node count so far in this column, across its layers
            return (
              <div key={col} className="flex flex-col gap-8">
                {layers.map((layer) => (
                  <div key={layer.id}>
                    <Enter shown={shown} delay={COLUMN_START[col]} slide={false}>
                      <p className="mb-3 font-montserrat text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                        {layer.title}
                        <span className="text-accent">.</span>
                      </p>
                    </Enter>
                    <div className="flex flex-wrap gap-2.5 lg:flex-col">
                      {layer.skills.map((id) => node(id, COLUMN_START[col] + index++ * NODE_STEP, true))}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {FLOWS.map(([from, to]) => {
          const lit = !active || from === active || to === active
          return (
            <motion.div
              key={`${from}-${to}`}
              className="pointer-events-none absolute inset-0 hidden lg:block"
              initial={{ opacity: 0 }}
              animate={shown ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : COLUMN_START[COLUMN_OF[to]] + 0.2 }}
            >
              <AnimatedBeam
                play={shown}
                containerRef={containerRef}
                fromRef={refs[from]}
                toRef={refs[to]}
                delay={PULSE_START + COLUMN_OF[from] * STEP}
                duration={BEAM_DURATION}
                repeatDelay={STEP * 3 - BEAM_DURATION}
                className={cn('transition-opacity duration-300', !lit && 'opacity-15')}
              />
            </motion.div>
          )
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-dashed border-line pt-6">
        <Enter shown={shown} delay={0.3} slide={false}>
          <p className="mr-2 font-montserrat text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            {SHIPS_WITH.title}
            <span className="text-accent">.</span>
          </p>
        </Enter>
        {SHIPS_WITH.skills.map((id, i) => node(id, 0.3 + i * NODE_STEP, false))}
      </div>
    </div>
  )
}

export default SkillsDiagram
