import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { Pause, Play, RotateCcw, Volume2, VolumeX } from '../../icons'
import VideoTimeline from './VideoTimeline'
import VideoDoodles from './VideoDoodles'
import { cn } from '../../lib/utils'

// Picks up the intro video automatically once it's added; a drifting gradient stands in until then.
const videos = import.meta.glob<string>('../../assets/video/intro.{mp4,webm}', { eager: true, query: '?url', import: 'default' })
const videoSrc = Object.values(videos)[0]

/** Small round control button for the video box. */
function Control({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full bg-white/85 text-coal shadow-lg shadow-black/10 backdrop-blur-sm transition-colors hover:bg-white"
    >
      {children}
    </button>
  )
}

/**
 * The intro video, after the hero: a rounded player in the video's own shape (never cropped),
 * with a seek bar and play / restart / mute. Starts muted, plays only while on screen.
 */
function VideoReveal() {
  const boxRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  // The video's width ÷ height (portrait videos are below 1). Known once its metadata loads.
  const [aspect, setAspect] = useState(16 / 9)

  // Only play while the player is on screen.
  const inView = useInView(boxRef, { amount: 0.4 })
  // Doodles draw in once, the first time the player comes into view.
  const doodlesShown = useInView(boxRef, { amount: 0.4, once: true })
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (inView && !paused) void video.play().catch(() => {})
    else video.pause()
  }, [inView, paused])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }
  const togglePlay = () => setPaused((p) => !p)
  const restart = () => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    setPaused(false)
    void video.play()
  }

  const portrait = aspect < 1
  const unmute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    setMuted(false)
  }

  return (
    <section
      aria-label="Intro video"
      className="mx-auto w-full max-w-[1440px] overflow-x-clip px-5 pt-28 pb-16 md:pr-10 md:pl-24 lg:py-24"
    >
      {/* Wrapper is exactly the player's size, so the doodles can sit around its edges */}
      <div className={cn('relative mx-auto', portrait ? 'w-fit' : 'w-full max-w-[1120px]')}>
        <VideoDoodles shown={doodlesShown} muted={muted} onUnmute={unmute} />
        <div
          ref={boxRef}
          className="relative isolate overflow-hidden rounded-[28px] bg-coal shadow-2xl shadow-black/10"
          // Portrait: as tall as fits on screen (and never wider than a phone screen). Landscape: full width.
          style={{
            aspectRatio: aspect,
            height: portrait ? `min(80svh, 900px, calc((100vw - 2.5rem) / ${aspect}))` : undefined,
            width: portrait ? undefined : '100%',
          }}
        >
          {videoSrc ? (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget
                  if (v.videoWidth && v.videoHeight) setAspect(v.videoWidth / v.videoHeight)
                }}
                className="absolute inset-0 size-full object-contain"
              />
              {/* Player bar along the bottom: timeline on top, buttons below, over a soft dark fade for contrast */}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 via-black/30 to-transparent px-4 pt-10 pb-4">
                <VideoTimeline videoRef={videoRef} />
                <div className="mt-2 flex items-center gap-2">
                  <Control label={paused ? 'Play' : 'Pause'} onClick={togglePlay}>
                    {paused ? <Play size={18} /> : <Pause size={18} />}
                  </Control>
                  <span className="flex-1" />
                  <Control label="Restart" onClick={restart}>
                    <RotateCcw size={18} />
                  </Control>
                  <Control label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
                    {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </Control>
                </div>
              </div>
            </>
          ) : (
            <p className="absolute bottom-6 left-6 rounded-full bg-white/85 px-4 py-2 font-montserrat text-sm font-semibold text-coal backdrop-blur-sm">
              Intro video coming soon
            </p>
          )}
        </div>
      </div>
      <span className="sr-only">Intro video: a short walk through who I am and what I build.</span>
    </section>
  )
}

export default VideoReveal
