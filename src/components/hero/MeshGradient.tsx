/**
 * Slowly drifting mesh gradient in the brand colours, like the V2 banner in design_inspriations.
 * Soft radial blobs (no blur filter, so it stays cheap) move with transform-only keyframes,
 * and a fine grain sits on top so it doesn't look like a flat screen gradient.
 * Fills its positioned parent; put content above it.
 */

// Inline SVG noise, tiled. Kept tiny so it costs nothing to load.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const BLOBS = [
  // colour, position/size, drift animation
  { color: 'var(--color-gradient-amber)', className: '-top-[25%] -left-[30%] size-[95%] animate-drift-a' },
  { color: 'var(--color-card-disc)', className: '-top-[30%] -right-[35%] size-[100%] animate-drift-b' },
  { color: 'var(--color-gradient-pink)', className: 'top-[25%] left-[5%] size-[90%] animate-drift-c' },
  { color: 'var(--color-gradient-orange)', className: '-right-[30%] -bottom-[35%] size-[95%] animate-drift-b [animation-direction:alternate-reverse]' },
]

/**
 * `soft`: for big areas (like the full-screen video stage). Drops the grain, which looks like
 * pixels when stretched across a whole screen, and blurs the blobs so they melt into one smooth gradient.
 */
function MeshGradient({ soft = false }: { soft?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-card">
      {/* Soft mode blurs the whole blob layer; it's oversized so the blur never shows a hard edge. */}
      <div className={soft ? 'absolute -inset-[15%] blur-[90px] will-change-transform' : 'absolute inset-0'}>
        {BLOBS.map((blob, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-90 will-change-transform ${blob.className}`}
            style={{ background: `radial-gradient(circle at center, ${blob.color} 0%, ${blob.color} 20%, transparent 68%)` }}
          />
        ))}
      </div>
      {!soft && (
        <>
          {/* A little depth at the bottom so the white name stays easy to read on the lighter blobs */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[rgb(150_20_100/0.35)] to-transparent" />
          <div className="absolute inset-0 opacity-25 mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
        </>
      )}
    </div>
  )
}

export default MeshGradient
