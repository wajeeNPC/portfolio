import { useEffect, useState } from 'react'
import GlassFolder from '../ui/glass-folder-cards'
import { PROJECTS } from '../../data/projects'
import { FOLDERS } from '../../data/folders'
import { STACK_ICON } from '../../data/skills'
import SkillLogo from '../skills/SkillLogo'
import { DOCS } from '../../data/docs'
import FileViewer from './FileViewer'

/** Folder width for the screen: smaller on phones so it fits with the side gutter. */
function useFolderWidth() {
  const query = '(min-width: 640px)'
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setWide(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return wide ? 400 : 320
}

// Entrance delays for the four folders: shrinking gaps so the row arrives as one wave.
const DELAYS = [0, 120, 200, 260]

/**
 * Selected work as glass folders on a dotted desk. Hover a folder to lean its glass toward you,
 * click to open it and fan out the files (illustration first, then the key facts).
 */
/** Which file is pulled out of which folder, and the sheet it came from */
type Viewing = { slug: string; index: number; sheet: HTMLElement }

function WorkFolders() {
  const width = useFolderWidth()
  const [viewing, setViewing] = useState<Viewing | null>(null)

  // Pages for a project, in folder order. Only files with a page in data/docs.ts can be pulled out.
  const pagesFor = (slug: string) =>
    (FOLDERS[slug]?.files ?? []).flatMap((file) => {
      const page = DOCS[slug]?.[file.name]
      return page ? [{ name: file.name, page }] : []
    })

  return (
    <div className="relative isolate -mx-5 overflow-hidden px-5 py-12 md:mx-0 md:rounded-[32px] md:px-8 md:py-16">
      {/* Dotted desk */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 text-ink opacity-[0.13]"
        style={{ backgroundImage: 'radial-gradient(currentColor 1.1px, transparent 1.4px)', backgroundSize: '22px 22px' }}
      />

      <div className="mx-auto grid max-w-[960px] grid-cols-1 justify-items-center gap-x-14 gap-y-14 lg:grid-cols-2">
        {PROJECTS.map((project, i) => {
          const look = FOLDERS[project.slug]
          if (!look) return null
          return (
            <article key={project.slug} className="flex flex-col items-center">
              <GlassFolder
                label={project.title}
                meta={project.kind}
                tone={look.tone}
                art={look.art}
                seed={look.seed}
                files={look.files}
                action="none"
                width={width}
                appearDelay={DELAYS[i] ?? 0}
                cover={look.cover}
                coverText={look.coverText}
                onFileSelect={
                  DOCS[project.slug]
                    ? (file, _i, sheet) => {
                        const index = pagesFor(project.slug).findIndex((p) => p.name === file.name)
                        if (index >= 0 && !viewing) setViewing({ slug: project.slug, index, sheet })
                      }
                    : undefined
                }
              />
              <p className="mt-6 max-w-[360px] text-center font-montserrat text-sm leading-relaxed text-muted">
                {project.tagline}
              </p>
              <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
                {project.stack.map((tech) => {
                  const skill = STACK_ICON[tech]
                  return (
                    <li
                      key={tech}
                      className="flex items-center gap-1.5 rounded-full border border-line py-1 pr-2.5 pl-2 font-montserrat text-[11px] font-semibold"
                    >
                      {skill && <SkillLogo skill={skill} className="size-3.5 shrink-0" />}
                      {tech}
                    </li>
                  )
                })}
              </ul>
            </article>
          )
        })}
      </div>

      <p className="mt-12 text-center font-montserrat text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
        Hover to lean · Click to open
      </p>

      {viewing && (
        <FileViewer
          project={PROJECTS.find((p) => p.slug === viewing.slug)?.title ?? ''}
          pages={pagesFor(viewing.slug)}
          index={viewing.index}
          onIndexChange={(index) => setViewing((v) => (v ? { ...v, index } : v))}
          sheet={viewing.sheet}
          onClosed={() => setViewing(null)}
        />
      )}
    </div>
  )
}

export default WorkFolders
