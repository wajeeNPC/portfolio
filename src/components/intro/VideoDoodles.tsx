import { motion } from 'motion/react'
import { cn } from '../../lib/utils'
import Doodle from '../ui/doodle'
import bubble from '../../assets/doodles/speech bubble, chat, chat bubble, talk, speak, message,  2.png'
import sparkles from '../../assets/doodles/spark, sparks, sparkle, stars, 30.png'
import braceOpen from '../../assets/doodles/braces, curly braces, symbol, open, character, line.png'
import braceClose from '../../assets/doodles/braces, curly braces, symbol, close, character, line.png'
import smiley from '../../assets/doodles/emoji, emoticon, smiley, smile, grin, happy, face, emotion, 2.png'
import arrow from '../../assets/doodles/arrow, hand drawn, scribble, doodle, 10.png'
import dots from '../../assets/doodles/snow, rain, drops, weather, sparkle, pattern.png'

/*
 * Hand-drawn doodles around the intro video, so the portrait player doesn't float in empty space.
 * The PNGs are black line art; they're used as masks over `currentColor`, so they can be tinted
 * (ink or pink) and still show in dark mode.
 *
 * Desktop (lg+) gets the full scene in the side space: { braces } around the player like a code block,
 * a "hi!" bubble, sparkles, a smiley, a dot pattern, and a "Turn the sound on" note pointing at the mute button.
 * Smaller screens have no side space, so only the bubble and sparkles show, above the player.
 */

/**
 * Put inside a `relative` wrapper that is exactly the player's size.
 * `shown` plays the entrance (once the player scrolls into view).
 */
function VideoDoodles({ shown, muted, onUnmute }: { shown: boolean; muted: boolean; onUnmute: () => void }) {
  return (
    <>
      {/* Code-block braces either side of the player */}
      <Doodle
        src={braceOpen}
        shown={shown}
        delay={0}
        className="top-1/2 -left-28 hidden h-[46%] w-auto -translate-y-1/2 text-accent lg:block"
      />
      <Doodle
        src={braceClose}
        shown={shown}
        delay={0}
        className="top-1/2 -right-28 hidden h-[46%] w-auto -translate-y-1/2 text-accent lg:block"
      />

      {/* "hi!" bubble: top-left (above the player on small screens) */}
      <Doodle
        src={bubble}
        shown={shown}
        delay={0.12}
        rotate={-6}
        className="-top-20 -left-2 w-24 text-ink lg:top-[6%] lg:-left-64 lg:w-40"
      >
        <span className="absolute inset-x-0 top-[28%] text-center text-xl font-extrabold text-ink lg:text-3xl">
          hi<span className="text-accent">!</span>
        </span>
      </Doodle>

      {/* Sparkles: top-right corner */}
      <Doodle
        src={sparkles}
        shown={shown}
        delay={0.2}
        float
        className="-top-16 right-0 w-16 text-accent lg:-top-10 lg:-right-44 lg:w-28"
      />

      {/* Smiley + dots: lower left */}
      <Doodle
        src={smiley}
        shown={shown}
        delay={0.26}
        rotate={-10}
        className="bottom-[14%] -left-56 hidden w-20 text-ink lg:block"
      />
      <Doodle src={dots} shown={shown} delay={0.3} className="top-[42%] -left-80 hidden w-28 text-ink/40 xl:block" />

      {/* "Turn the sound on" note, with an arrow down to the mute button (bottom-right of the player) */}
      <motion.button
        type="button"
        onClick={onUnmute}
        initial={false}
        animate={{ opacity: shown && muted ? 1 : 0 }}
        transition={{ duration: 0.4, delay: shown && muted ? 0.34 : 0 }}
        tabIndex={muted ? 0 : -1}
        aria-hidden={!muted}
        className={cn(
          'absolute -right-64 bottom-[8.5rem] hidden w-40 text-left text-base leading-tight font-semibold text-ink lg:block',
          !muted && 'pointer-events-none',
        )}
      >
        Turn the sound on<span className="text-accent">.</span>
      </motion.button>
      <Doodle src={arrow} shown={shown && muted} delay={0.4} className="-right-28 bottom-6 hidden w-24 text-ink lg:block" />
    </>
  )
}

export default VideoDoodles
