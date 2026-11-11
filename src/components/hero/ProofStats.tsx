import { motion, useReducedMotion } from 'motion/react'
import NumberTicker from './NumberTicker'

const STATS = [
  { value: '+2', label: 'Years experience' },
  { value: '+90', label: 'Tables in one database' },
  { value: '2', label: 'Platforms shipped' },
]

/** "Proof, not just promises." band from the Figma frame. Numbers count up as it scrolls into view. */
function ProofStats() {
  const reduceMotion = useReducedMotion()
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Proof, not just promises<span className="text-accent">.</span>
      </h2>
      <ul className="mt-12 grid gap-10 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <motion.li
            key={stat.label}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : [0, 0.09, 0.16][i] }}
          >
            <p className="text-[clamp(48px,5.5vw,80px)] leading-none font-semibold tracking-tight tabular-nums">
              <NumberTicker value={stat.value} delay={0.15 + i * 0.08} />
            </p>
            <p className="mt-3 font-montserrat text-base text-muted">{stat.label}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export default ProofStats
