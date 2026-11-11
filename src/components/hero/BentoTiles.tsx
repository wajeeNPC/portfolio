import { MessageCircle } from '../../icons'
import NumberTicker from './NumberTicker'

/** Small corner bracket from the reference design. */
export function CornerMark({ className = '', weight = 1.6 }: { className?: string; weight?: number }) {
  // Inset the path by half the stroke so thick marks don't get clipped.
  const o = weight / 2
  return (
    <svg viewBox="0 0 12 12" className={`size-3 ${className}`} fill="none" aria-hidden="true">
      <path d={`M${o} ${o}H${12 - o}V${12 - o}`} stroke="currentColor" strokeWidth={weight} strokeLinecap="square" />
    </svg>
  )
}

function SoonChip({ className = '' }: { className?: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 font-montserrat text-[11px] font-semibold ${className}`}>
      Coming soon
    </span>
  )
}

/** `value` like "90+": the number counts up, the rest stays. `delay` in seconds. */
type Stat = { value: string; label: string; delay?: number }

/** Two stats stacked in one card, split into two flat colours. */
export function StatsTile({ top, bottom }: { top: Stat; bottom: Stat }) {
  return (
    <div className="grid h-full min-h-[160px] grid-cols-2 lg:min-h-0 overflow-hidden rounded-[20px] sm:grid-cols-1 sm:grid-rows-2">
      <StatHalf stat={top} className="bg-gradient-pink text-coal" />
      <StatHalf stat={bottom} className="bg-gradient-purple text-white" />
    </div>
  )
}

function StatHalf({ stat, className }: { stat: Stat; className: string }) {
  return (
    <div className={`relative flex flex-col justify-center p-5 ${className}`}>
      <CornerMark className="absolute top-4 right-4 opacity-70" />
      <p className="text-3xl font-semibold tracking-tight tabular-nums xl:text-4xl">
        <NumberTicker value={stat.value} delay={stat.delay} />
      </p>
      <p className="mt-1 font-montserrat text-sm font-medium">{stat.label}</p>
    </div>
  )
}

/** Small neutral tile with a centred icon (the "Clients" tile in the reference). */
export function AskTile() {
  return (
    <div className="relative flex h-full min-h-[180px] flex-col items-center lg:min-h-0 justify-center gap-3 rounded-[20px] bg-graphite p-5 text-center text-white ring-1 ring-line">
      <CornerMark className="absolute top-4 right-4 text-white/70" />
      <MessageCircle size={34} strokeWidth={1.8} aria-hidden="true" />
      <p className="font-montserrat text-base font-medium">Ask my portfolio</p>
      <SoonChip className="bg-white/15 text-white" />
    </div>
  )
}

/**
 * Split tile like the reference: black card with a centred sphere on the left,
 * a rounded amber panel set into it on the right.
 */
export function ProjectTile() {
  return (
    <a
      href="#work"
      className="group flex h-full min-h-[180px] overflow-hidden rounded-[20px] bg-coal ring-1 ring-line transition-transform duration-300 hover:-translate-y-1 lg:min-h-0"
    >
      <div className="grid w-2/5 shrink-0 place-items-center p-4">
        {/* Sphere drawn in CSS so it sits cleanly on black (the PNG has a cream background) */}
        <span
          aria-hidden="true"
          className="aspect-square w-[68%] max-w-[150px] rounded-full shadow-[inset_-10px_-14px_28px_rgb(120_20_10/0.45),0_10px_30px_rgb(242_47_176/0.25)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-12"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #ffd6f4 0%, #ff9ee0 18%, #ff7bca 38%, #f5502a 78%, #b8341c 100%)',
          }}
        />
      </div>

      <div className="relative flex flex-1 flex-col justify-center rounded-[20px] bg-gradient-amber p-5 text-coal sm:p-6">
        <CornerMark className="absolute top-4 right-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        <p className="font-montserrat text-[11px] font-semibold tracking-wide uppercase opacity-70">Featured build</p>
        <p className="mt-1 text-[clamp(24px,2.4vw,34px)] leading-tight font-semibold tracking-tight">MSME Loan RAG</p>
        <p className="mt-1 line-clamp-2 font-montserrat text-sm font-medium">
          Citation-backed answers, measured on a 33-question eval.
        </p>
      </div>
    </a>
  )
}
