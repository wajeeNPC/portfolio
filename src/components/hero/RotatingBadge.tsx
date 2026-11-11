/**
 * Round badge with text running around its edge, slowly spinning (like the reference's "My design portfolio" disc).
 * Pass position + size in className (defaults to an in-flow 112px badge).
 */
function RotatingBadge({ text, className = 'relative size-28' }: { text: string; className?: string }) {
  return (
    <div className={`grid place-items-center rounded-full bg-coal shadow-xl shadow-black/20 ${className}`}>
      {/* outer ring, like the reference */}
      <span aria-hidden="true" className="absolute -inset-2 rounded-full border-[3px] border-coal/50" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-spin-slow" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-white font-montserrat text-[8.5px] font-semibold uppercase" letterSpacing="1.5">
          <textPath href="#badge-circle" textLength="228" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="size-[32%] rounded-full bg-white" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </div>
  )
}

export default RotatingBadge
