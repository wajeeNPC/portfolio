import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Play, X } from '../../icons'
import torus from '../../assets/shapes/torus.png'
import { lockScroll } from '../../lib/lenis'

// Picks up the intro video automatically once it's added; shows "coming soon" until then.
const videos = import.meta.glob<string>('../../assets/video/intro.{mp4,webm}', { eager: true, query: '?url', import: 'default' })
const videoSrc = Object.values(videos)[0]

// The round thumbnail grows into the player and shrinks back, as one object.
const LAYOUT_ID = 'intro-video'
const EXPAND = { type: 'spring', duration: 0.5, bounce: 0.12 } as const

function Artwork() {
  return <img src={torus} alt="" draggable={false} className="absolute inset-0 size-full object-cover" />
}

/**
 * "Watch intro" button: a round artwork thumbnail with a play icon and a label.
 * Click and the thumbnail expands into a full player (Magic UI "Hero Video Dialog" pattern).
 */
function IntroVideo() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    lockScroll(true)
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
      trigger?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex min-h-11 items-center gap-3 rounded-full py-1 pr-2 font-montserrat text-sm font-semibold"
      >
        <span className="relative grid size-11 place-items-center">
          {!open && (
            <motion.span
              layoutId={LAYOUT_ID}
              transition={EXPAND}
              style={{ borderRadius: 22 }}
              className="absolute inset-0 overflow-hidden"
            >
              <Artwork />
            </motion.span>
          )}
          <Play
            size={15}
            className="relative translate-x-px fill-white text-white drop-shadow transition-transform duration-300 ease-out group-hover:scale-115"
            aria-hidden="true"
          />
        </span>
        <span className="flex flex-col items-start leading-tight">
          Watch intro
          <span className="text-xs font-medium text-muted">{videoSrc ? '1 min' : 'Coming soon'}</span>
        </span>
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[90] grid place-items-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Intro video">
              <motion.div
                className="absolute inset-0 bg-coal/60 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                layoutId={LAYOUT_ID}
                transition={EXPAND}
                style={{ borderRadius: 24 }}
                className="relative aspect-video w-full max-w-5xl overflow-hidden bg-coal shadow-2xl shadow-black/40"
              >
                {videoSrc ? (
                  <video src={videoSrc} autoPlay controls playsInline className="absolute inset-0 size-full object-cover" />
                ) : (
                  <>
                    <Artwork />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="absolute inset-0 grid place-items-center p-6"
                    >
                      <div className="rounded-2xl bg-white/85 px-6 py-4 text-center text-coal backdrop-blur-md">
                        <p className="text-xl font-semibold sm:text-2xl">
                          Intro video is on its way<span className="text-accent">.</span>
                        </p>
                        <p className="mt-1 font-montserrat text-sm text-coal/70">A short walk through who I am and what I build.</p>
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
              <motion.button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/90 text-coal shadow-lg sm:top-6 sm:right-6"
              >
                <X size={20} aria-hidden="true" />
              </motion.button>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

export default IntroVideo
