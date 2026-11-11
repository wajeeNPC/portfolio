import { Bot, FileSearch, Gauge, Layers, Transmission, Tuning, type IconComponent } from '../icons'

// Brand logos from tech-stack-icons.com (MIT), plus the official FastAPI and Chroma marks.
// Only the files we use live in src/assets/stack; "<slug>-dark.svg" is the dark-mode version when one exists.
const LOGOS = import.meta.glob<string>('../assets/stack/*.svg', { eager: true, query: '?url', import: 'default' })

export type Skill = {
  id: string
  name: string
  logo?: string
  logoDark?: string
  /** For things that aren't a brand. */
  icon?: IconComponent
  /** Projects shown on hover. Leave out when there's nothing to point to yet. */
  usedIn?: string[]
}

function brand(id: string, name: string, usedIn?: string[]): Skill {
  return {
    id,
    name,
    logo: LOGOS[`../assets/stack/${id}.svg`],
    logoDark: LOGOS[`../assets/stack/${id}-dark.svg`],
    usedIn,
  }
}

// "Used in" comes from each project's dependency files (package.json, composer.json, requirements, docker-compose).
const PAARRA = 'Paarra'
const REALTER = 'RealterCRM'
const MSME = 'MSME RAG'
const CORE = 'Core Energy'

export const SKILL = {
  react: brand('react', 'React', [PAARRA, REALTER, CORE]),
  typescript: brand('typescript', 'TypeScript', [PAARRA, CORE]),
  nextjs: brand('nextjs', 'Next.js', [CORE]),
  threejs: brand('threejs', 'Three.js', [CORE]),
  tailwindcss: brand('tailwindcss', 'Tailwind CSS', [PAARRA, REALTER, CORE]),
  laravel: brand('laravel', 'Laravel', [PAARRA, REALTER]),
  fastapi: brand('fastapi', 'FastAPI', [PAARRA]),
  python: brand('python', 'Python', [PAARRA, MSME]),
  langgraph: brand('langgraph', 'LangGraph', [PAARRA]),
  langchain: brand('langchain', 'LangChain', [PAARRA, MSME]),
  rag: { id: 'rag', name: 'RAG & Evals', icon: FileSearch, usedIn: [MSME, PAARRA] },
  openai: brand('openai', 'OpenAI', [PAARRA, MSME]),
  huggingface: brand('huggingface', 'Hugging Face', [MSME]),
  claude: brand('claude', 'Claude'),
  ollama: brand('ollama', 'Ollama'),
  mysql: brand('mysql', 'MySQL', [PAARRA, REALTER]),
  supabase: brand('supabase', 'Supabase', [PAARRA]),
  chroma: brand('chroma', 'Chroma', [MSME]),
  redis: brand('redis', 'Redis', [PAARRA, REALTER]),
  docker: brand('docker', 'Docker', [PAARRA, REALTER]),
  railway: brand('railway', 'Railway', [PAARRA]),
  git: brand('git', 'Git'),
  github: brand('github', 'GitHub'),
} satisfies Record<string, Skill>

export type SkillId = keyof typeof SKILL

/** The stack as layers a request passes through, drawn as columns in the diagram. */
export const LAYERS: { id: string; title: string; skills: SkillId[] }[] = [
  { id: 'frontend', title: 'Frontend', skills: ['react', 'typescript', 'nextjs', 'threejs', 'tailwindcss'] },
  { id: 'api', title: 'APIs', skills: ['laravel', 'fastapi', 'python'] },
  { id: 'ai', title: 'AI engine', skills: ['langgraph', 'langchain', 'rag'] },
  { id: 'models', title: 'Models', skills: ['openai', 'huggingface', 'claude', 'ollama'] },
  { id: 'data', title: 'Data', skills: ['mysql', 'supabase', 'chroma', 'redis'] },
  { id: 'ship', title: 'Ships with', skills: ['docker', 'railway', 'git', 'github'] },
]

/**
 * How requests flow between neighbouring columns: [from, to]. Drawn as beams.
 * Modelled on real projects: Paarra's React app calls Laravel, Laravel calls the FastAPI + LangGraph
 * engine, which checkpoints to Redis and stores vectors in Supabase; MSME RAG runs LangChain over Chroma.
 */
export const FLOWS: [SkillId, SkillId][] = [
  ['react', 'laravel'],
  ['typescript', 'laravel'],
  ['laravel', 'langgraph'],
  ['fastapi', 'langgraph'],
  ['python', 'langchain'],
  ['python', 'rag'],
  ['langgraph', 'openai'],
  ['langchain', 'openai'],
  ['langchain', 'huggingface'],
  ['langgraph', 'redis'],
  ['langgraph', 'supabase'],
  ['rag', 'chroma'],
]

/**
 * Icon for a project stack chip (Work section), by the chip's label.
 * Brands use their logo; the rest get a Solar icon. Labels not listed here show text only.
 */
export const STACK_ICON: Record<string, Skill> = {
  RAG: SKILL.rag,
  Chroma: SKILL.chroma,
  OpenAI: SKILL.openai,
  Evals: { id: 'evals', name: 'Evals', icon: Gauge },
  'React 19': SKILL.react,
  'Laravel 12': SKILL.laravel,
  FastAPI: SKILL.fastapi,
  LangGraph: SKILL.langgraph,
  Inertia: { id: 'inertia', name: 'Inertia', icon: Layers },
  Redis: SKILL.redis,
  Reverb: { id: 'reverb', name: 'Reverb', icon: Transmission },
  Agents: { id: 'agents', name: 'Agents', icon: Bot },
  'Fine-tuning': { id: 'fine-tuning', name: 'Fine-tuning', icon: Tuning },
}
