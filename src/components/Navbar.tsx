import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { AnimatedThemeToggler } from './ui/animated-theme-toggler'

/** Top bar: logo, theme toggle and Let's Talk. Section links live in the SideRail. */
function Navbar() {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-background/70 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-4 md:pl-24 md:pr-10">
        <a href="#about" className="text-2xl font-bold tracking-tight text-ink">
          Wajee<span className="text-accent">.</span>
        </a>

        <div className="flex items-center gap-3">
          <AnimatedThemeToggler
            theme={theme}
            onThemeChange={setTheme}
            className="grid size-11 cursor-pointer place-items-center rounded-full text-ink transition-opacity hover:opacity-60 [&_svg]:size-5"
          />
          <a
            href="#contact"
            className="rounded-xl bg-ink px-6 py-3 font-montserrat text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Let&rsquo;s Talk
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
