// Adapted from Magic UI's Animated Theme Toggler (magicui.design, MIT).
// Changes: always controlled, switches the site's `data-theme` attribute instead of a `dark` class,
// and skips the reveal for visitors who prefer reduced motion. CSS for the reveal lives in index.css.
import { useCallback, useEffect, useRef } from 'react'
import { Moon, Sun } from '../../icons'
import { flushSync } from 'react-dom'

import { cn } from '../../lib/utils'

export type TransitionVariant = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'rectangle' | 'star'
type Theme = 'light' | 'dark'

interface AnimatedThemeTogglerProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'> {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  duration?: number
  variant?: TransitionVariant
  /** When true, the reveal grows from the middle of the screen instead of the button. */
  fromCenter?: boolean
}

function polygonCollapsed(point: string, vertexCount: number): string {
  return `polygon(${Array.from({ length: vertexCount }, () => point).join(', ')})`
}

// Coordinates are percentages of the snapshot box: some browsers mis-scale px clip-paths
// on fractional display scales (e.g. Windows at 150%).
function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number,
): [string, string] {
  const toX = (x: number) => `${(x / viewportWidth) * 100}%`
  const toY = (y: number) => `${(y / viewportHeight) * 100}%`
  const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`
  // circle() percentage radii resolve against hypot(w, h) / sqrt(2) of the box.
  const toRadius = (r: number) => `${(r / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100}%`

  switch (variant) {
    case 'square': {
      const halfSide = Math.max(Math.max(cx, viewportWidth - cx), Math.max(cy, viewportHeight - cy)) * 1.05
      const end = [
        point(cx - halfSide, cy - halfSide),
        point(cx + halfSide, cy - halfSide),
        point(cx + halfSide, cy + halfSide),
        point(cx - halfSide, cy + halfSide),
      ].join(', ')
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`]
    }
    case 'triangle': {
      const scale = maxRadius * 2.2
      const dx = (Math.sqrt(3) / 2) * scale
      const verts = [point(cx, cy - scale), point(cx + dx, cy + 0.5 * scale), point(cx - dx, cy + 0.5 * scale)].join(', ')
      return [polygonCollapsed(point(cx, cy), 3), `polygon(${verts})`]
    }
    case 'diamond': {
      const R = maxRadius * Math.SQRT2
      const end = [point(cx, cy - R), point(cx + R, cy), point(cx, cy + R), point(cx - R, cy)].join(', ')
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`]
    }
    case 'hexagon': {
      const R = maxRadius * Math.SQRT2
      const verts: string[] = []
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3
        verts.push(point(cx + R * Math.cos(a), cy + R * Math.sin(a)))
      }
      return [polygonCollapsed(point(cx, cy), 6), `polygon(${verts.join(', ')})`]
    }
    case 'rectangle': {
      const halfW = Math.max(cx, viewportWidth - cx)
      const halfH = Math.max(cy, viewportHeight - cy)
      const end = [
        point(cx - halfW, cy - halfH),
        point(cx + halfW, cy - halfH),
        point(cx + halfW, cy + halfH),
        point(cx - halfW, cy + halfH),
      ].join(', ')
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`]
    }
    case 'star': {
      const R = maxRadius * Math.SQRT2 * 1.03
      const starPolygon = (radius: number) => {
        const verts: string[] = []
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5
          verts.push(point(cx + radius * Math.cos(outerA), cy + radius * Math.sin(outerA)))
          const innerA = outerA + Math.PI / 5
          verts.push(point(cx + radius * 0.42 * Math.cos(innerA), cy + radius * 0.42 * Math.sin(innerA)))
        }
        return `polygon(${verts.join(', ')})`
      }
      return [starPolygon(Math.max(2, R * 0.025)), starPolygon(R)]
    }
    default:
      return [`circle(0% at ${point(cx, cy)})`, `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`]
  }
}

/**
 * Sun/moon button. Switching theme reveals the new colours in a growing circle from the button
 * (View Transitions). Browsers without View Transitions just switch instantly.
 */
export const AnimatedThemeToggler = ({
  className,
  duration = 500,
  variant = 'circle',
  fromCenter = false,
  theme,
  onThemeChange,
  ...props
}: AnimatedThemeTogglerProps) => {
  const isDark = theme === 'dark'
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isTransitioningRef = useRef(false)
  const activeAnimRef = useRef<Animation | null>(null)

  const cancelAnim = useCallback(() => {
    activeAnimRef.current?.cancel()
    activeAnimRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      cancelAnim()
      const root = document.documentElement
      if (root.dataset.themeVt !== 'active') return
      delete root.dataset.themeVt
      root.style.removeProperty('--theme-vt-duration')
      root.style.removeProperty('--theme-vt-clip-from')
    }
  }, [cancelAnim])

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current
    const root = document.documentElement
    if (!button || isTransitioningRef.current || root.dataset.themeVt === 'active') return

    const next: Theme = isDark ? 'light' : 'dark'
    // Set the attribute right away so the transition snapshots the new theme.
    const applyTheme = () => {
      root.dataset.theme = next
      onThemeChange(next)
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (typeof document.startViewTransition !== 'function' || reduceMotion) {
      applyTheme()
      return
    }

    // innerWidth/innerHeight include classic scrollbars, matching the snapshot box.
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    let x = viewportWidth / 2
    let y = viewportHeight / 2
    if (!fromCenter) {
      const { top, left, width, height } = button.getBoundingClientRect()
      x = left + width / 2
      y = top + height / 2
    }
    const maxRadius = Math.hypot(Math.max(x, viewportWidth - x), Math.max(y, viewportHeight - y))
    const clipPath = getThemeTransitionClipPaths(variant, x, y, maxRadius, viewportWidth, viewportHeight)

    root.dataset.themeVt = 'active'
    root.style.setProperty('--theme-vt-duration', `${duration}ms`)
    // Pin the collapsed shape in CSS so the new theme never paints unclipped before the animation starts.
    root.style.setProperty('--theme-vt-clip-from', clipPath[0])

    const cleanup = () => {
      isTransitioningRef.current = false
      delete root.dataset.themeVt
      root.style.removeProperty('--theme-vt-duration')
      root.style.removeProperty('--theme-vt-clip-from')
      cancelAnim()
    }

    isTransitioningRef.current = true
    const transition = document.startViewTransition(() => flushSync(applyTheme))
    transition.finished.finally(cleanup).catch(() => {})
    transition.ready
      .then(() => {
        activeAnimRef.current = root.animate(
          { clipPath },
          {
            duration,
            // Star uses linear so easing overshoot doesn't fight the polygon at the end.
            easing: variant === 'star' ? 'linear' : 'ease-in-out',
            fill: 'forwards',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
      .catch(() => {})
  }, [variant, fromCenter, duration, isDark, onThemeChange, cancelAnim])

  return (
    <button type="button" ref={buttonRef} onClick={toggleTheme} className={cn(className)} {...props}>
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
    </button>
  )
}
