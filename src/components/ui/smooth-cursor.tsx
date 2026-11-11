// Adapted from Magic UI's Smooth Cursor (magicui.design, MIT).
// Changes: moves with transforms instead of left/top, colours follow the theme, hides the native
// cursor everywhere (links and buttons included), hides when the pointer leaves the window, and
// stays off for touch screens and for visitors who prefer reduced motion, and turns into a hand
// over anything clickable.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useSpring } from 'motion/react'
import { Pointer } from 'lucide-react'

const DESKTOP_POINTER_QUERY = '(any-hover: hover) and (any-pointer: fine)'
const SPRING = { damping: 45, stiffness: 400, mass: 1, restDelta: 0.001 }

/** Things you can click: the cursor becomes a hand over these. */
const CLICKABLE =
  'a[href], button:not(:disabled), [role="button"], [role="link"], [role="tab"], summary, select, ' +
  'input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], [data-cursor="pointer"]'

const HAND_SIZE = 24

/** Arrow in the ink colour with a background-coloured outline, so it reads in light and dark mode. */
function CursorArrow() {
  return (
    <svg width={25} height={27} viewBox="0 0 50 54" fill="none" aria-hidden="true" className="drop-shadow-[0_2px_3px_rgb(0_0_0/0.12)]">
      <path
        d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
        fill="var(--color-ink)"
      />
      <path
        d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
        stroke="var(--color-background)"
        strokeWidth={2.25825}
      />
    </svg>
  )
}

/** Pointing hand: white with an ink outline, like the classic link cursor. Fingertip is at (8, 2) of 24. */
function CursorHand() {
  return (
    <Pointer
      size={HAND_SIZE}
      strokeWidth={1.8}
      fill="var(--color-background)"
      stroke="var(--color-ink)"
      aria-hidden="true"
      className="drop-shadow-[0_2px_3px_rgb(0_0_0/0.18)]"
    />
  )
}

export function SmoothCursor() {
  const reduceMotion = useReducedMotion()
  const [hasMouse, setHasMouse] = useState(false)
  const [visible, setVisible] = useState(false)
  const [overClickable, setOverClickable] = useState(false)
  const [pressed, setPressed] = useState(false)
  const enabled = hasMouse && !reduceMotion

  const last = useRef({ x: 0, y: 0, t: 0 })
  const previousAngle = useRef(0)
  const accumulatedRotation = useRef(0)

  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)
  const rotate = useSpring(0, { ...SPRING, damping: 60, stiffness: 300 })
  const scale = useSpring(1, { ...SPRING, stiffness: 500, damping: 35 })

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_POINTER_QUERY)
    const update = () => setHasMouse(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let timeout: ReturnType<typeof setTimeout> | undefined
    let frame = 0
    let latest: PointerEvent | null = null

    const apply = () => {
      frame = 0
      const e = latest
      if (!e) return
      setVisible(true)
      const target = e.target instanceof Element ? e.target : null
      setOverClickable(!!target?.closest(CLICKABLE))

      const now = performance.now()
      const dt = now - last.current.t
      const vx = dt > 0 ? (e.clientX - last.current.x) / dt : 0
      const vy = dt > 0 ? (e.clientY - last.current.y) / dt : 0
      last.current = { x: e.clientX, y: e.clientY, t: now }

      x.set(e.clientX)
      y.set(e.clientY)

      // Point the arrow the way it's moving, taking the short way round.
      if (Math.hypot(vx, vy) > 0.1) {
        const angle = (Math.atan2(vy, vx) * 180) / Math.PI + 90
        let diff = angle - previousAngle.current
        if (diff > 180) diff -= 360
        if (diff < -180) diff += 360
        accumulatedRotation.current += diff
        rotate.set(accumulatedRotation.current)
        previousAngle.current = angle

        scale.set(0.95)
        clearTimeout(timeout)
        timeout = setTimeout(() => scale.set(1), 150)
      }
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      latest = e
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const onLeave = () => setVisible(false)
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    document.documentElement.classList.add('smooth-cursor')
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      document.documentElement.classList.remove('smooth-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
    }
  }, [enabled, x, y, rotate, scale])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] will-change-transform"
      style={{ x, y }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Swap between arrow and hand: a quick scale + fade, both centred on the pointer position */}
      <AnimatePresence initial={false}>
        {overClickable ? (
          <motion.div
            key="hand"
            className="absolute top-0 left-0"
            // Put the fingertip on the pointer, and grow from there
            style={{ x: -8, y: -2, originX: 8 / HAND_SIZE, originY: 2 / HAND_SIZE }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: pressed ? 0.85 : 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', duration: 0.25, bounce: 0.2 }}
          >
            <CursorHand />
          </motion.div>
        ) : (
          <motion.div
            key="arrow"
            className="absolute top-0 left-0"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', duration: 0.25, bounce: 0.2 }}
          >
            <motion.div style={{ translateX: '-50%', translateY: '-50%', rotate, scale }}>
              <CursorArrow />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
