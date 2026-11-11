import { NAV_ITEMS } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'

const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

/**
 * Section navigation.
 * Desktop: a fixed vertical rail on the left with sideways labels.
 * Mobile: a floating pill bar at the bottom.
 */
function SideRail() {
  const active = useActiveSection(SECTION_IDS)

  return (
    <>
      <nav
        aria-label="Sections"
        className="fixed inset-y-0 left-0 z-30 hidden w-20 items-center justify-center md:flex"
      >
        <ul className="flex flex-col items-center gap-10 border-r border-line py-6 pr-5">
          {NAV_ITEMS.map(({ id, label }) => {
            const isActive = active === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex rotate-180 items-center gap-2 py-1 font-montserrat text-sm font-medium transition-colors [writing-mode:vertical-rl] ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full bg-accent transition-transform duration-300 ${
                      isActive ? 'scale-100' : 'scale-0'
                    }`}
                  />
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <nav aria-label="Sections" className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <ul className="mx-auto flex max-w-sm items-center justify-between rounded-full border border-line bg-surface px-2 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex min-h-11 min-w-12 flex-col items-center justify-center gap-0.5 rounded-full px-2 font-montserrat text-[11px] font-medium transition-colors ${
                    isActive ? 'text-accent' : 'text-muted'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}

export default SideRail
