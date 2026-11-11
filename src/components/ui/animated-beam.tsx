// Adapted from Magic UI's Animated Beam (magicui.design, MIT).
// Changes: relative imports, a `dimmed` state for hover focus, and a static line when the
// visitor prefers reduced motion.
import { useEffect, useId, useState, type RefObject } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '../../lib/utils'

/** An element's position inside `container`, ignoring CSS transforms. */
function offsetWithin(el: HTMLElement, container: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== container) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}

export interface AnimatedBeamProps {
  /** Start the travelling light. Until then only the faint track is drawn. */
  play?: boolean
  className?: string
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  repeatDelay?: number
}

export function AnimatedBeam({
  play = true,
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 5,
  delay = 0,
  pathColor = 'currentColor',
  pathWidth = 2,
  pathOpacity = 0.15,
  gradientStartColor = '#f22fb0',
  gradientStopColor = '#ffc56f',
  repeatDelay = 0,
}: AnimatedBeamProps) {
  const id = useId()
  const reduceMotion = useReducedMotion()
  const [pathD, setPathD] = useState('')
  const [size, setSize] = useState({ width: 0, height: 0 })

  // The beam's light sweeps left to right (or back when reversed).
  const x1 = reverse ? ['90%', '-10%'] : ['10%', '110%']
  const x2 = reverse ? ['100%', '0%'] : ['0%', '100%']

  useEffect(() => {
    const updatePath = () => {
      const box = containerRef.current
      const from = fromRef.current
      const to = toRef.current
      if (!box || !from || !to) return
      setSize({ width: box.offsetWidth, height: box.offsetHeight })

      // Layout positions (not getBoundingClientRect) so nodes mid-animation don't bend the beams.
      const a = offsetWithin(from, box)
      const b = offsetWithin(to, box)

      // Leave from the right edge of the first node and land on the left edge of the second.
      const startX = a.x + from.offsetWidth
      const startY = a.y + from.offsetHeight / 2
      const endX = b.x
      const endY = b.y + to.offsetHeight / 2
      setPathD(`M ${startX},${startY} Q ${(startX + endX) / 2},${startY - curvature} ${endX},${endY}`)
    }

    const observer = new ResizeObserver(updatePath)
    if (containerRef.current) observer.observe(containerRef.current)
    updatePath()
    return () => observer.disconnect()
  }, [containerRef, fromRef, toRef, curvature])

  return (
    <svg
      fill="none"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      className={cn('pointer-events-none absolute top-0 left-0 transform-gpu', className)}
    >
      <path d={pathD} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} strokeLinecap="round" />
      {play && !reduceMotion && (
        <>
          <path d={pathD} strokeWidth={pathWidth} stroke={`url(#${id})`} strokeLinecap="round" />
          <defs>
            <motion.linearGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }}
              animate={{ x1, x2, y1: ['0%', '0%'], y2: ['0%', '0%'] }}
              transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay }}
            >
              <stop stopColor={gradientStartColor} stopOpacity="0" />
              <stop stopColor={gradientStartColor} />
              <stop offset="32.5%" stopColor={gradientStopColor} />
              <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </>
      )}
    </svg>
  )
}
