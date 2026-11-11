import { Bot, Building2, FileSearch, Sparkles, type IconComponent } from '../icons'

export type Project = {
  slug: string
  /** Small label above the title, e.g. "Case study" */
  kind: string
  title: string
  tagline: string
  stack: string[]
  /** Flat panel colour + matching text colour (Tailwind classes) */
  tone: string
  /** Shown when there is no cover image yet */
  icon: IconComponent
  /** Illustration from src/assets/illustrations, used instead of the icon when there is no cover image */
  illustration?: string
  /** Where the panel links to. Leave out until the page exists. */
  href?: string
  comingSoon?: boolean
}

/**
 * Work section panels, in display order (the number comes from the position).
 * Cover images are picked up automatically from src/assets/projects/<slug>/cover.(png|webp|jpg).
 */
export const PROJECTS: Project[] = [
  {
    slug: 'msme-rag',
    kind: 'Case study',
    title: 'MSME Loan RAG',
    tagline: 'Citation-backed answers on Sri Lankan SME loan schemes, measured on a 33-question eval.',
    stack: ['RAG', 'Chroma', 'OpenAI', 'Evals'],
    tone: 'bg-gradient-pink text-coal',
    icon: FileSearch,
  },
  {
    slug: 'paarra',
    kind: 'Architecture story',
    title: 'Paarra',
    tagline: 'Multi-tenant AI SaaS with a LangGraph engine, RAG on Supabase vectors and multimodal input.',
    stack: ['React 19', 'Laravel 12', 'FastAPI', 'LangGraph'],
    tone: 'bg-gradient-purple text-white',
    icon: Bot,
  },
  {
    slug: 'realter-crm',
    kind: 'Architecture story',
    title: 'RealterCRM',
    tagline: 'Real-estate and facilities CRM on a 90+ table schema, with queued lead imports and live updates.',
    stack: ['Laravel 12', 'Inertia', 'Redis', 'Reverb'],
    tone: 'bg-gradient-amber text-coal',
    icon: Building2,
  },
  {
    slug: 'next',
    kind: 'In the lab',
    title: 'Next build',
    tagline: 'Something with agents and fine-tuning. Shipping in public soon.',
    stack: ['Agents', 'Fine-tuning'],
    tone: 'bg-graphite text-white',
    icon: Sparkles,
    comingSoon: true,
  },
]
