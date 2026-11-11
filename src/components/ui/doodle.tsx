import { motion, useReducedMotion } from 'motion/react'
import { cn } from '../../lib/utils'

/*
 * A hand-drawn doodle from src/assets/doodles. The PNGs are black line art, so they're used as a mask
 * over `currentColor`: tint them with a text colour (text-ink, text-accent) and they work in dark mode too.
 * Position it with absolute classes; `shown` plays a small pop-in (after `delay` seconds).
 */

const EASE = [0.22, 1, 0.36, 1] as const

function Doodle({
  src,
  shown,
  delay,
  rotate = 0,
  float = false,
  flip = false,
  className,
  children,
}: {
  src: string
  shown: boolean
  delay: number
  rotate?: number
  float?: boolean
  /** Mirror the drawing left-to-right (text inside stays readable) */
  flip?: boolean
  className?: string
  children?: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.span
      aria-hidden="true"
      initial={false}
      animate={
        shown
          ? { opacity: 1, scale: 1, rotate }
          : { opacity: 0, scale: reduceMotion ? 1 : 0.8, rotate: reduceMotion ? rotate : rotate - 10 }
      }
      transition={{ duration: 0.6, delay: shown && !reduceMotion ? delay : 0, ease: EASE }}
      className={cn('pointer-events-none absolute block aspect-square', className)}
    >
      <span
        className={cn('block size-full bg-current', float && 'animate-float', flip && '-scale-x-100')}
        style={{
          maskImage: `url("${src}")`,
          WebkitMaskImage: `url("${src}")`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      />
      {children}
    </motion.span>
  )
}

export default Doodle
