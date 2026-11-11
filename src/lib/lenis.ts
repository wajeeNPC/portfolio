import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/** The page's smooth-scroll instance, or null when the visitor prefers reduced motion. */
export let lenis: Lenis | null = null

/** Starts smooth scrolling once. Returns a cleanup function. */
export function startLenis() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  // anchors: in-page links (#work, #contact…) glide instead of jumping.
  lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 })
  return () => {
    lenis?.destroy()
    lenis = null
  }
}

/** Freezes page scrolling (e.g. while a dialog is open). */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
