import * as React from 'react'

import { cn } from '../../lib/utils'

/**
 * Rainbow button (Magic UI): a dark button with a moving rainbow edge and a soft rainbow glow underneath.
 * Flips to a white button in dark mode. Adapted without class-variance-authority / Radix Slot.
 * The rainbow colours (--color-1..5) and the `rainbow` animation live in index.css.
 */
export const RainbowButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'group relative inline-flex shrink-0 animate-rainbow cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition-all',
        'rounded-xl font-montserrat text-sm font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-accent/40',
        'disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        // Fill colour, flipped for dark mode
        'text-white [--rb-fill:#121213] [--rb-fade:rgba(18,18,19,0.6)]',
        'dark:text-coal dark:[--rb-fill:#ffffff] dark:[--rb-fade:rgba(255,255,255,0.6)]',
        // Solid fill, with the rainbow showing through a 2px transparent border
        'border-2 border-transparent bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box]',
        '[background-image:linear-gradient(var(--rb-fill),var(--rb-fill)),linear-gradient(var(--rb-fill)_50%,var(--rb-fade)_80%,transparent),var(--rainbow)]',
        // Glow under the bottom edge
        'before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow',
        'before:bg-[length:200%] before:[background-image:var(--rainbow)] before:[filter:blur(0.75rem)]',
        className,
      )}
      {...props}
    />
  ),
)
RainbowButton.displayName = 'RainbowButton'
