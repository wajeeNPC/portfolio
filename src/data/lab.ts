import { Bot, Cpu, FlaskConical, Gauge, Plug } from '../icons'
import type { Project } from './projects'
import fineTuning from '../assets/illustrations/settings _ options, preferences, screwdriver, gear, man.png'
import agents from '../assets/illustrations/communication, chat _ message, chat, messaging, conversation, woman.png'
import evals from '../assets/illustrations/business _ update chart, update, increase, up, chart, graph, woman.png'
import localModels from '../assets/illustrations/Occupation _ character, laptop man, laptop, computer, man.png'
import mcp from '../assets/illustrations/files and folders _ files, folder, file, sort, man.png'

/**
 * What I'm learning in public, shown as numbered colour panels in the Lab section.
 * Add a picture by dropping it in src/assets/projects/<slug>/cover.(png|webp|jpg); the illustration shows until then.
 */
export const LAB: Project[] = [
  {
    slug: 'lab-fine-tuning',
    kind: 'In the lab',
    title: 'Fine-tuning',
    tagline: 'Small open models tuned on narrow tasks, to see where a tuned model beats a long prompt.',
    stack: ['LoRA', 'Hugging Face', 'Python'],
    tone: 'bg-gradient-purple text-white',
    icon: FlaskConical,
    illustration: fineTuning,
    comingSoon: true,
  },
  {
    slug: 'lab-agents',
    kind: 'In the lab',
    title: 'Agents',
    tagline: 'Tool-using agents that plan, call APIs and recover from their own mistakes.',
    stack: ['LangGraph', 'Tool calling', 'Redis'],
    tone: 'bg-gradient-amber text-coal',
    icon: Bot,
    illustration: agents,
    comingSoon: true,
  },
  {
    slug: 'lab-evals',
    kind: 'Learning in public',
    title: 'Evals',
    tagline: 'Test sets and LLM judges, so changes to a prompt or model are measured instead of guessed.',
    stack: ['LLM-as-judge', 'Test sets', 'Tracing'],
    tone: 'bg-gradient-pink text-coal',
    icon: Gauge,
    illustration: evals,
    comingSoon: true,
  },
  {
    slug: 'lab-local-models',
    kind: 'Learning in public',
    title: 'Local models',
    tagline: 'Running open models on my own machine: speed, memory and how far quantised models go.',
    stack: ['Ollama', 'llama.cpp', 'Quantisation'],
    tone: 'bg-graphite text-white',
    icon: Cpu,
    illustration: localModels,
    comingSoon: true,
  },
  {
    slug: 'lab-mcp',
    kind: 'Learning in public',
    title: 'MCP servers',
    tagline: 'Small Model Context Protocol servers that plug my own tools and data into AI assistants.',
    stack: ['MCP', 'TypeScript', 'Python'],
    tone: 'bg-gradient-orange text-coal',
    icon: Plug,
    illustration: mcp,
    comingSoon: true,
  },
]
