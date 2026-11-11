import { useId } from 'react'

/**
 * Two Gaussian-blurred circles with linear-gradient fills.
 * Colors are driven by design tokens defined in src/index.css (@theme).
 */
function Gradient({ className }: { className?: string }) {
  // Unique ids so the hero and the footer can both use it on one page
  const uid = useId().replace(/:/g, '')
  const id = (name: string) => `${name}_${uid}`

  return (
    <svg
      className={className}
      viewBox="0 0 1029.21 1029.21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
    >
      <g>
        <g filter={`url(#${id('gradient_blur_eclipse')})`}>
          <circle cx="514.606" cy="514.606" r="314.606" fill={`url(#${id('gradient_eclipse')})`} />
        </g>
        <g filter={`url(#${id('gradient_blur_planet')})`}>
          <circle cx="622.8" cy="392.6" r="230.2" fill={`url(#${id('gradient_planet')})`} />
        </g>
      </g>
      <defs>
        <filter
          id={id('gradient_blur_eclipse')}
          x="0"
          y="0"
          width="1029.21"
          height="1029.21"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id={id('gradient_blur_planet')}
          x="292.6"
          y="62.4"
          width="660.4"
          height="660.4"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur" />
        </filter>
        <linearGradient
          id={id('gradient_eclipse')}
          x1="514.606"
          y1="200"
          x2="514.606"
          y2="829.213"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-gradient-pink)" />
          <stop offset="1" stopColor="var(--color-gradient-amber)" stopOpacity="0.46" />
        </linearGradient>
        <linearGradient
          id={id('gradient_planet')}
          x1="622.8"
          y1="162.401"
          x2="622.8"
          y2="622.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-gradient-magenta)" />
          <stop offset="1" stopColor="var(--color-gradient-orange)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-gradient-purple)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Gradient
