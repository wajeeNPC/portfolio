import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

/**
 * Counts a stat like "90+" up from zero when it comes into view (Magic UI "Number Ticker" pattern).
 * Text that isn't the number (+, %, …) stays put. Screen readers always get the final value.
 */
function NumberTicker({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  const target = match ? Number(match[2]) : 0

  useEffect(() => {
    const el = ref.current
    if (!el || !target || !inView || reduceMotion) return
    // Ease out hard so the last few numbers settle slowly, like a counter coming to rest.
    const controls = animate(0, target, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, reduceMotion, target, delay])

  if (!match) return <>{value}</>
  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {match[1]}
        <span ref={ref}>{reduceMotion ? target : 0}</span>
        {match[3]}
      </span>
    </>
  )
}

export default NumberTicker
