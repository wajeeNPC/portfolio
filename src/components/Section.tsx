import type { ReactNode } from 'react'

/** Page section with the pink-dot heading. The id links it to the side rail. */
function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string
  title?: string
  intro?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 md:py-24">
      {title && (
        <header className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
            <span className="text-accent">.</span>
          </h2>
          {intro && <p className="mt-3 font-montserrat text-base text-muted">{intro}</p>}
        </header>
      )}
      {children}
    </section>
  )
}

/** Dashed box for sections that are designed but not built yet. */
export function Placeholder({ label }: { label: string }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-3xl border-2 border-dashed border-line p-8 text-center font-montserrat text-sm text-muted">
      {label}
    </div>
  )
}

export default Section
