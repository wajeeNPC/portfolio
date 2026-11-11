import { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { cn } from '../../lib/utils'

// One shared pointer position for every shape on the page (-1 to 1 across the window).
const pointer = { x: 0, y: 0, listeners: new Set<() => void>() }
let attached = false

function attach() {
  if (attached || typeof window === 'undefined') return
  attached = true
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      pointer.listeners.forEach((fn) => fn())
    },
    { passive: true },
  )
}

/**
 * A glossy 3D shape that bobs gently and drifts against the mouse.
 * `depth` sets how far it travels (px at the window edge): bigger feels closer to you.
 * Position and size come from `className`. Decorative only.
 */
function FloatingShape({
  src,
  depth = 16,
  floatDelay = 0,
  className,
}: {
  src: string
  depth?: number
  floatDelay?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 60, damping: 20, mass: 0.8 }
  const x = useSpring(useTransform(px, (v) => v * -depth), spring)
  const y = useSpring(useTransform(py, (v) => v * -depth), spring)

  useEffect(() => {
    if (reduceMotion) return
    attach()
    const update = () => {
      px.set(pointer.x)
      py.set(pointer.y)
    }
    pointer.listeners.add(update)
    return () => {
      pointer.listeners.delete(update)
    }
  }, [reduceMotion, px, py])

  return (
    <motion.div aria-hidden="true" className={cn('pointer-events-none absolute z-20', className)} style={{ x, y }}>
      <img
        src={src}
        alt=""
        draggable={false}
        className="size-full animate-float object-contain drop-shadow-[0_18px_24px_rgb(242_47_176/0.25)]"
        style={{ animationDelay: `${floatDelay}s` }}
      />
    </motion.div>
  )
}

export default FloatingShape
