import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
import { cn } from '../../lib/utils'

/*
 * Magic UI Shimmer Button, adapted:
 * - renders a link (<a>), since our calls to action jump to sections
 * - fully round by default, to match the pills used across the site
 * - the shimmer is hidden for reduced motion (the button itself stays)
 * Animations (shimmer-slide, spin-around) live in index.css.
 */
export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'a'> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
}

export function ShimmerButton({
  shimmerColor = '#ffffff',
  shimmerSize = '0.05em',
  shimmerDuration = '3s',
  borderRadius = '9999px',
  background = 'rgba(0, 0, 0, 1)',
  className,
  children,
  style,
  ...props
}: ShimmerButtonProps) {
  return (
    <a
      style={
        {
          '--spread': '90deg',
          '--shimmer-color': shimmerColor,
          '--radius': borderRadius,
          '--speed': shimmerDuration,
          '--cut': shimmerSize,
          '--bg': background,
          ...style,
        } as CSSProperties
      }
      className={cn(
        'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-6 py-3 whitespace-nowrap text-white [background:var(--bg)]',
        'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
        className,
      )}
      {...props}
    >
      {/* spark container */}
      <div className="absolute inset-0 -z-30 overflow-visible blur-[2px] motion-reduce:hidden" style={{ containerType: 'size' }}>
        {/* spark */}
        <div className="absolute inset-0 aspect-square h-[100cqh] animate-shimmer-slide rounded-none [mask:none]">
          {/* spark before */}
          <div className="absolute -inset-full w-auto rotate-0 animate-spin-around [translate:0_0] [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      {children}

      {/* highlight */}
      <div className="absolute inset-0 size-full [border-radius:var(--radius)] shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />

      {/* backdrop */}
      <div className="absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]" />
    </a>
  )
}

export default ShimmerButton
