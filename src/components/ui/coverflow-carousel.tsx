import * as React from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from '../../icons'

import { cn } from '../../lib/utils'

const useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

export interface CoverflowSlide {
  src: string
  alt: string
  title?: string
  subtitle?: string
  /** Small pill above the title, e.g. "Reading now" */
  badge?: string
  /** Card colour behind the image (any CSS colour) */
  background?: string
  /** Pink dot on the badge, to mark the highlighted one */
  badgeActive?: boolean
  /** Icon shown in the badge in place of the dot */
  badgeIcon?: React.ReactNode
  description?: string
  meta?: { label: string; value: string }[]
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[]
  /** Degrees the first neighbour tilts. */
  rotate?: number
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number
  /** Opacity lost per step from the centre. */
  fade?: number
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string
  /** Card height as a multiple of its width: 1 is square, 1.5 is a book. */
  aspect?: number
  /** Space between cards, as a fraction of card width. */
  gap?: number
  loop?: boolean
  showCaption?: boolean
  showPagination?: boolean
  showNavigation?: boolean
  /** Names the carousel for assistive tech. */
  label?: string
  className?: string
  cardClassName?: string
  imageClassName?: string
}

/**
 * 3D cover carousel: the centre card faces you, its neighbours tilt away.
 * Drag, flick, use the arrow keys, or the buttons and dots.
 * Positions are painted straight to the DOM each frame instead of through React state.
 */
export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = 'clamp(148px, 22vw, 260px)',
  aspect = 1,
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  label = 'Cover carousel',
  className,
  cardClassName,
  imageClassName,
}: CoverflowCarouselProps) {
  const count = slides.length
  const cardHeight = `calc(var(--cf-card) * ${aspect})`

  const frameRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([])
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0)
  /** Where the current settle is headed, so a keypress mid-flight steps from the target. */
  const targetRef = React.useRef(0)
  const widthRef = React.useRef(0)
  const rafRef = React.useRef<number | null>(null)
  const dragRef = React.useRef<{ id: number; x: number; pos: number; v: number; t: number } | null>(null)

  const [selected, setSelected] = React.useState(0)

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback((pos: number) => ((Math.round(pos) % count) + count) % count, [count])

  const paint = React.useCallback(() => {
    const width = widthRef.current
    if (!width) return
    const pitch = width * (1 + gap)
    const pos = posRef.current

    cardRefs.current.forEach((card, index) => {
      if (!card) return

      // Fold the distance into the shorter way round the ring: that is the whole loop, no cloned nodes.
      let offset = index - pos
      if (loop) {
        offset = ((offset % count) + count) % count
        if (offset > count / 2) offset -= count
      }

      const distance = Math.abs(offset)
      // Tilt and recession ease off as cards travel out, so the second card stays readable.
      const ramp = Math.pow(distance, falloff)
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset)

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`

      // A card jumps across the ring at half a turn out, so it must be invisible by then.
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge)
      card.style.zIndex = String(100 - Math.round(distance))
    })
  }, [count, depth, fade, falloff, gap, loop, rotate])

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      targetRef.current = target
      setSelected(indexAt(target))

      const step = () => {
        const remaining = target - posRef.current
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target
          paint()
          rafRef.current = null
          return
        }
        // Exponential ease-out toward the target.
        posRef.current += remaining * 0.16
        paint()
        rafRef.current = requestAnimationFrame(step)
      }
      rafRef.current = requestAnimationFrame(step)
    },
    [indexAt, paint],
  )

  const clamp = React.useCallback((pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))), [count, loop])

  const goTo = React.useCallback(
    (index: number) => {
      // Take the shorter way round rather than unwinding the whole ring.
      const target = loop ? index + Math.round((targetRef.current - index) / count) * count : index
      settle(clamp(target))
    },
    [clamp, count, loop, settle],
  )

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  )

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    targetRef.current = posRef.current
    dragRef.current = { id: event.pointerId, x: event.clientX, pos: posRef.current, v: 0, t: performance.now() }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return

    const pitch = widthRef.current * (1 + gap)
    if (!pitch) return

    const now = performance.now()
    const previous = posRef.current
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch)
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000
    drag.t = now

    const index = indexAt(posRef.current)
    if (index !== selected) setSelected(index)
    paint()
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    dragRef.current = null
    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18))
    settle(clamp(Math.round(posRef.current + carried)))
  }

  // Card width drives pitch, depth and perspective, so it is the only thing worth measuring.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const measure = () => {
      const card = cardRefs.current[0]
      if (!card) return
      widthRef.current = card.offsetWidth
      paint()
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [paint])

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    },
    [],
  )

  const active = slides[selected]

  return (
    <div
      // isolate: keeps the cards' and buttons' stacking inside the carousel, so the site cursor stays on top
      className={cn('isolate w-full', className)}
      style={{ ['--cf-card' as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              nudge(-1)
            } else if (event.key === 'ArrowRight') {
              event.preventDefault()
              nudge(1)
            }
          }}
          // Vertical padding keeps the drop shadows clear of the overflow clip.
          className="cursor-grab overflow-hidden rounded-2xl py-10 ring-accent outline-none focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: 'pan-y',
          }}
        >
          <div className="relative select-none" style={{ height: cardHeight, transformStyle: 'preserve-3d' }}>
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => {
                  cardRefs.current[index] = node
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                className={cn(
                  'absolute top-0 left-1/2 overflow-hidden rounded-2xl bg-line shadow-xl will-change-transform',
                  cardClassName,
                )}
                style={{ width: 'var(--cf-card)', height: cardHeight, background: slide.background }}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  draggable={false}
                  className={cn('h-full w-full object-cover select-none', imageClassName)}
                />
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute top-1/2 left-3 z-[150] grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-background/80 text-ink backdrop-blur transition hover:bg-background"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute top-1/2 right-3 z-[150] grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-background/80 text-ink backdrop-blur transition hover:bg-background"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <motion.div
          key={selected}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          aria-live="polite"
          className="mt-2 flex flex-col items-center px-6 text-center"
        >
          {active.badge && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-montserrat text-[10px] font-semibold tracking-wide uppercase">
              {active.badgeIcon ?? (
                <span aria-hidden="true" className={cn('size-1.5 rounded-full', active.badgeActive ? 'bg-accent' : 'bg-muted')} />
              )}
              {active.badge}
            </span>
          )}
          <p className="text-[17px] font-semibold tracking-tight text-ink">{active.title}</p>
          {active.subtitle && <p className="mt-1 font-montserrat text-[13px] text-muted">{active.subtitle}</p>}
          {active.description && (
            <p className="mt-3 max-w-[360px] font-montserrat text-sm leading-relaxed text-muted">{active.description}</p>
          )}
          {active.meta && active.meta.length > 0 && (
            <dl className="mt-6 w-full max-w-[230px] font-montserrat text-[12px]">
              {active.meta.map((row) => (
                <div key={row.label} className="flex justify-between py-[5px]">
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="font-medium text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </motion.div>
      )}

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn('size-2 rounded-full bg-ink transition-opacity', index === selected ? 'opacity-100' : 'opacity-30')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
