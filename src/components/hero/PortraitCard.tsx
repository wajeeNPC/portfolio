import { Clover, Download, Mail, UserRound } from '../../icons'
import { SITE } from '../../data/site'
import RotatingBadge from './RotatingBadge'
import MeshGradient from './MeshGradient'

// Picks up the portrait automatically once the file is added; shows a placeholder until then.
const portraits = import.meta.glob<string>('../../assets/photos/portrait.{png,webp}', {
  eager: true,
  import: 'default',
})
const portraitSrc = Object.values(portraits)[0]

/** Inverted rounded corner, used where the "About me" tab meets the card. */
function InnerCorner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute size-6 ${className}`}
      style={{ background: 'radial-gradient(circle at 100% 100%, transparent 23.5px, var(--color-background) 24px)' }}
    />
  )
}

/**
 * "About me" card, laid out like the reference:
 * shallow folder tab top-left, portrait circle top-right,
 * name + email bottom-left, rotating badge bottom-right.
 */
function PortraitCard() {
  return (
    <article className="relative isolate flex h-full min-h-[clamp(580px,140vw,720px)] flex-col overflow-hidden rounded-3xl p-6 text-white sm:p-7 lg:min-h-0">
      <MeshGradient />

      {/* Folder tab cut-out with the "About me" label */}
      <div className="absolute top-0 left-0 z-20 flex h-11 w-[42%] min-w-40 items-center gap-2 rounded-br-3xl bg-background pl-1 font-montserrat text-sm font-semibold text-ink transition-colors duration-300">
        <Clover size={16} className="text-accent" aria-hidden="true" />
        About me
      </div>
      <InnerCorner className="top-0 left-[max(42%,10rem)] z-20" />
      <InnerCorner className="top-11 left-0 z-20" />

      {/*
        Portrait area: takes the space left above the name. The circle sizes itself to
        fit that space (whichever is smaller: 72% of the width or the full height),
        so it can never run into the name.
      */}
      <div className="flex min-h-0 flex-1 justify-end pt-7 pr-[2%] pb-4 [container-type:size]">
        <div className="relative aspect-square size-[min(72cqw,100cqh,420px)] shrink-0">
          <div aria-hidden="true" className="absolute inset-0 rounded-full border-[8px] border-white lg:border-[10px]" />
          <div aria-hidden="true" className="absolute inset-[7%] rounded-full bg-card-disc" />
          <div className="absolute inset-x-[7%] -top-[22%] bottom-[7%] flex items-end justify-center overflow-hidden rounded-b-full">
            {portraitSrc ? (
              <img
                src={portraitSrc}
                alt={`Portrait of ${SITE.firstName} ${SITE.lastName}`}
                className="h-full w-auto max-w-none object-contain object-bottom grayscale"
              />
            ) : (
              <div className="mb-[22%] flex flex-col items-center gap-2 px-4 text-center text-white/90">
                <UserRound className="size-14 sm:size-20" strokeWidth={1.2} aria-hidden="true" />
                <span className="font-montserrat text-[10px] font-medium">Add src/assets/photos/portrait.png</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name and contact, bottom-left. Right padding keeps clear of the badge. */}
      <div className="shrink-0">
        <p className="text-[clamp(32px,3.4vw,48px)] leading-none font-extralight">I&rsquo;m,</p>
        <p className="mt-1 text-[clamp(40px,4.4vw,64px)] leading-[1.02] font-medium tracking-tight">
          {SITE.firstName}
          <br />
          {SITE.lastName}
          <span className="text-gradient-amber">.</span>
        </p>
        <p className="mt-2 font-montserrat text-sm font-semibold text-white/90">{SITE.title}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 sm:pr-32">
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex min-h-11 items-center gap-2 border-b border-dashed border-white/80 font-montserrat text-sm font-medium hover:border-white"
          >
            {SITE.email}
            <Mail size={15} aria-hidden="true" />
          </a>
          <a
            href={SITE.cvUrl}
            download="Shayeed_Wajee_CV.pdf"
            className="inline-flex min-h-11 items-center gap-1.5 font-montserrat text-sm font-semibold underline-offset-4 hover:underline"
          >
            <Download size={15} aria-hidden="true" />
            CV
          </a>
        </div>
      </div>

      {/* Bottom-right on tablet/desktop; top-left (the empty corner) on phones */}
      <RotatingBadge
        text="2026 · Software & AI Engineer · Portfolio ·"
        className="absolute top-16 left-5 size-20 sm:top-auto sm:right-7 sm:bottom-7 sm:left-auto sm:size-28"
      />
    </article>
  )
}

export default PortraitCard
