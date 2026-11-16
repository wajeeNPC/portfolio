import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Check, Mail, MessageSquare, Send, User, type IconComponent } from '../../icons'
import { SITE } from '../../data/site'
import { RainbowButton } from '../ui/rainbow-button'
import linkedin from '../../assets/icons/linkedin.svg'
import github from '../../assets/icons/github.svg'
import gmail from '../../assets/icons/gmail.svg'
import whatsapp from '../../assets/icons/whatsapp.svg'

const LINKS = [
  { label: 'Email', href: `mailto:${SITE.email}`, icon: gmail },
  { label: 'LinkedIn', href: SITE.socials.linkedin, icon: linkedin },
  { label: 'GitHub', href: SITE.socials.github, icon: github },
  { label: 'WhatsApp', href: SITE.socials.whatsapp, icon: whatsapp },
]

// Ribbed glass: this many vertical strips over the glow
const STRIPS = 11

const FIELD =
  'w-full rounded-xl border border-line bg-background px-3.5 py-2.5 font-montserrat text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/20'

// Web3Forms access key (free, from web3forms.com), set in portfolio/.env.local as VITE_WEB3FORMS_KEY.
// Without it, Send falls back to opening the visitor's email app.
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Contact card: a coal panel with a pink glow seen through ribbed glass on the left,
 * and a light form on the right. Sending delivers the message straight to my inbox via Web3Forms.
 */
function ContactCard() {
  const reduceMotion = useReducedMotion()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const openEmailApp = () => {
    const subject = `Hello from ${name || 'your portfolio'}`
    const body = `${message}\n\n— ${name}${email ? ` (${email})` : ''}`
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!FORM_KEY) return openEmailApp()
    // Hidden field only bots fill in
    if (new FormData(event.currentTarget).get('botcheck')) return

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: `Portfolio message from ${name}`,
          from_name: 'Portfolio contact form',
          name,
          email,
          message,
        }),
      })
      const data = (await res.json()) as { success?: boolean }
      if (!res.ok || !data.success) throw new Error('Send failed')
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="grid overflow-hidden rounded-[20px] ring-1 ring-line md:grid-cols-2">
      {/* Left: glow through ribbed glass */}
      <div className="relative isolate min-h-[320px] overflow-hidden bg-coal p-8 md:min-h-[520px] md:p-12">
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-[30%] -left-[15%] -z-20 h-[85%] w-[95%] rounded-full blur-2xl"
          style={{
            background:
              'radial-gradient(ellipse at 45% 75%, #fff4ea 0%, #ff7bca 16%, #f22fb0 32%, rgb(112 97 163 / 0.7) 52%, transparent 72%)',
          }}
          animate={reduceMotion ? undefined : { x: ['0%', '8%', '0%'], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 flex">
          {Array.from({ length: STRIPS }, (_, i) => (
            <div
              key={i}
              className="h-full flex-1 backdrop-blur-xl"
              style={{
                background:
                  'linear-gradient(90deg, rgb(0 0 0 / 0.45) 0%, rgb(255 255 255 / 0.07) 55%, rgb(0 0 0 / 0.3) 100%)',
              }}
            />
          ))}
        </div>

        <p className="max-w-[380px] text-2xl leading-snug font-semibold tracking-tight text-white md:text-[28px]">
          AI and software partner for teams building what's next<span className="text-accent">.</span>
        </p>
      </div>

      {/* Right: the form */}
      <div className="bg-surface p-8 md:p-12">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Let's collaborate<span className="text-accent">.</span>
        </h2>
        <p className="mt-2 font-montserrat text-[15px] text-muted">Open to AI projects that stretch what I know. Say hi.</p>

        <form onSubmit={onSubmit} onChange={() => status !== 'sending' && setStatus('idle')} className="mt-8 space-y-4">
          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <FieldLabel icon={User}>Your name</FieldLabel>
              <input
                required
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className={FIELD}
              />
            </label>
            <label className="block">
              <FieldLabel icon={Mail}>Your email</FieldLabel>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={FIELD}
              />
            </label>
          </div>
          <label className="block">
            <FieldLabel icon={MessageSquare}>Message</FieldLabel>
            <textarea
              required
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me a little about the project"
              className={`${FIELD} resize-none`}
            />
          </label>

          <RainbowButton type="submit" disabled={status === 'sending'} className="min-h-11 w-full active:scale-[0.99]">
            {status === 'sending' ? 'Sending…' : 'Send message'}
            <Send aria-hidden="true" className="size-4" />
          </RainbowButton>

          <p role="status" aria-live="polite" className="min-h-5 text-center font-montserrat text-[13px]">
            {status === 'sent' && (
              <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                <Check aria-hidden="true" className="size-4 text-accent" />
                Thanks, your message is in my inbox. I'll get back to you soon.
              </span>
            )}
            {status === 'error' && (
              <span className="text-muted">
                That didn't go through. Please try again, or{' '}
                <a href={`mailto:${SITE.email}`} className="font-medium text-accent underline underline-offset-2">
                  email me directly
                </a>
                .
              </span>
            )}
          </p>
        </form>

        {/* Other ways to reach me */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="font-montserrat text-[13px] text-muted">Or reach me on</span>
          <ul className="flex gap-2">
            {LINKS.map(({ label, href, icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="grid size-10 place-items-center rounded-full border border-line bg-background transition-transform hover:-translate-y-0.5"
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
      </div>
    </div>
  )
}

/** Field label with a small icon in front */
function FieldLabel({ icon: Icon, children }: { icon: IconComponent; children: string }) {
  return (
    <span className="mb-1.5 flex items-center gap-1.5 font-montserrat text-[13px] font-medium">
      <Icon aria-hidden="true" className="size-3.5 text-ink" strokeWidth={2.2} />
      {children}
    </span>
  )
}

export default ContactCard
