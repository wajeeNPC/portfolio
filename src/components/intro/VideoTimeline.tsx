import { useEffect, useRef, useState, type RefObject } from 'react'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Seek bar for a <video>: a thin track that thickens on hover, a pink fill for the time played,
 * and a native range input on top so dragging, clicking and arrow keys all work.
 */
function VideoTimeline({ videoRef }: { videoRef: RefObject<HTMLVideoElement | null> }) {
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let frame = 0

    // Move the fill every frame while playing (timeupdate alone only fires ~4 times a second).
    const paint = () => {
      if (fillRef.current && video.duration) {
        fillRef.current.style.transform = `scaleX(${video.currentTime / video.duration})`
      }
    }
    const loop = () => {
      paint()
      frame = requestAnimationFrame(loop)
    }
    const onPlay = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(loop)
    }
    const onPause = () => {
      cancelAnimationFrame(frame)
      paint()
    }
    const onTime = () => {
      setTime(video.currentTime)
      if (video.paused) paint()
    }
    const onMeta = () => setDuration(video.duration)

    onMeta()
    onTime()
    if (!video.paused) onPlay()
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('seeked', onTime)
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    return () => {
      cancelAnimationFrame(frame)
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('seeked', onTime)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [videoRef])

  const seek = (value: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = value
    setTime(value)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-[4.5rem] shrink-0 font-montserrat text-xs font-semibold text-white tabular-nums">
        {formatTime(time)} / {formatTime(duration)}
      </span>
      <div className="group/track relative flex h-6 flex-1 items-center">
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/30 transition-[height] duration-200 group-hover/track:h-1.5">
          <div ref={fillRef} className="absolute inset-0 origin-left scale-x-0 rounded-full bg-accent" />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
          aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}

export default VideoTimeline
