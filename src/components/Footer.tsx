import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Check, Copy, Download } from '../icons'
import { NAV_ITEMS, SITE } from '../data/site'
import { PROJECTS } from '../data/projects'
import Gradient from './Gradient'
import linkedin from '../assets/icons/linkedin.svg'
import github from '../assets/icons/github.svg'
import gmail from '../assets/icons/gmail.svg'
import whatsapp from '../assets/icons/whatsapp.svg'

const SOCIALS = [
  { label: 'LinkedIn', href: SITE.socials.linkedin, icon: linkedin },
  { label: 'GitHub', href: SITE.socials.github, icon: github },
  { label: 'WhatsApp', href: SITE.socials.whatsapp, icon: whatsapp },
  { label: 'Email', href: `mailto:${SITE.email}`, icon: gmail },
]

const COLUMNS = [
  {
    title: 'Explore',
    links: NAV_ITEMS.map(({ id, label }) => ({ label, href: `#${id}` })),
  },
  {
    title: 'Projects',
    links: PROJECTS.filter((p) => !p.comingSoon).map((p) => ({ label: p.title, href: '#work' })),
  },
  {
    title: 'Elsewhere',
    links: [
      { label: 'LinkedIn', href: SITE.socials.linkedin },
      { label: 'GitHub', href: SITE.socials.github },
      { label: 'WhatsApp', href: SITE.socials.whatsapp },
      { label: 'CV (PDF)', href: SITE.cvUrl },
    ],
  },
]

const isExternal = (href: string) => href.startsWith('http')

/**
 * Footer: the hero's gradient rising from the bottom, holding the links
 * and a giant wordmark cut off by the page edge.
 */
function Footer({ page }: { page: string }) {
  const reduceMotion = useReducedMotion()
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${SITE.email}`
    }
  }

  return (
    <footer className="relative isolate overflow-hidden pt-32 pb-24 md:pt-44 md:pb-0">
      {/* The hero's gradient, stretched wide and rising from the bottom */}
      <Gradient className="pointer-events-none absolute -bottom-[45%] left-1/2 -z-10 h-[120%] w-[max(160vw,1400px)] -translate-x-1/2 opacity-90 dark:opacity-40" />

      {/* Links, on the gradient */}
      <div className={page}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.5fr] lg:gap-8">
          {/* Brand */}
          <div>
            <span className="text-3xl font-bold tracking-tight">
              Wajee<span className="text-accent">.</span>
            </span>
            <p className="mt-2 max-w-[220px] text-lg leading-snug opacity-80">{SITE.title}</p>
            <ul className="mt-6 flex gap-2.5">
              {SOCIALS.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={isExternal(href) ? '_blank' : undefined}
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="grid size-11 place-items-center rounded-full border border-ink/20 bg-background/40 backdrop-blur-sm transition-colors hover:bg-background/70"
                  >
                    <img
                      src={icon}
                      alt=""
                      aria-hidden="true"
                      className={`size-[18px] ${label === 'GitHub' ? 'dark:invert' : ''}`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {COLUMNS.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <p className="font-montserrat text-sm opacity-60">{title}</p>
              <ul className="mt-3 space-y-1.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={isExternal(href) ? '_blank' : undefined}
                      rel="noreferrer"
                      className="font-montserrat text-sm transition-opacity hover:opacity-60"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Let's talk: copy email + CV */}
          <div>
            <p className="font-montserrat text-sm opacity-60">Let's talk</p>
            <button
              type="button"
              onClick={copyEmail}
              className="mt-3 flex min-h-10 w-full items-center justify-between gap-2 rounded-full border border-ink/15 bg-background/50 px-4 text-left font-montserrat text-sm backdrop-blur-sm transition-colors hover:bg-background/80"
            >
              <span className="truncate">{SITE.email}</span>
              {copied ? (
                <Check aria-hidden="true" className="size-4 shrink-0" />
              ) : (
                <Copy aria-hidden="true" className="size-4 shrink-0 opacity-80" />
              )}
              <span className="sr-only" aria-live="polite">
                {copied ? 'Email copied' : 'Copy email'}
              </span>
            </button>
            <a
              href={SITE.cvUrl}
              download
              className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-ink font-montserrat text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
            >
              <Download aria-hidden="true" className="size-4" />
              Download CV
            </a>
          </div>
        </div>
      </div>

      {/* Giant wordmark, cut off by the bottom edge */}
      <motion.div
        aria-hidden="true"
        initial={{ y: reduceMotion ? 0 : '30%', opacity: reduceMotion ? 0 : 1 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`${page} mt-16 flex items-end select-none md:mt-20`}
      >
        <span className="-mb-[0.2em] text-[clamp(96px,21vw,330px)] leading-[0.85] font-semibold tracking-[-0.04em] text-white">
          Wajee
        </span>
      </motion.div>
    </footer>
  )
}

export default Footer
