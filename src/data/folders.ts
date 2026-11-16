import type { ArtRecipe, FolderFile } from '../components/ui/glass-folder-cards'
import msmeCover from '../assets/projects/msme-rag/cover.webp'
import paarraCover from '../assets/projects/paarra/cover.webp'
import realterCover from '../assets/projects/realter-crm/cover.webp'
import nextCover from '../assets/projects/next/cover.webp'

/**
 * How each project looks as a glass folder in the Work section, keyed by project slug.
 * `art` is the generated liquid artwork on the folder's back panel, in that project's brand colours.
 * `files` are what fan out when the folder opens: the illustration first, then the key facts.
 */
export type FolderLook = {
  art: ArtRecipe
  seed: number
  tone: 'light' | 'dark'
  /** Front cover colour, and whether its text is light (white) or dark */
  cover: string
  coverText: 'light' | 'dark'
  files: FolderFile[]
}

export const FOLDERS: Record<string, FolderLook> = {
  'msme-rag': {
    // amber and orange with a thread of pink
    art: {
      style: 'marble',
      colors: ['#3a1a08', '#a2470f', '#f58a25', '#ffc56f', '#fff4ea', '#ff7bca', '#f22fb0'],
      scale: 0.7,
      warp: 3.2,
      angle: -0.4,
      gloss: 0.5,
      veins: 0.35,
    },
    seed: 4,
    cover: '#ffc56f',
    coverText: 'dark',
    tone: 'light',
    files: [
      { name: 'Overview', meta: 'Case study', image: msmeCover },
      { name: 'How it works', meta: 'Pipeline' },
      { name: 'Findings', meta: '11 setups' },
      { name: 'How I measured', meta: '33 questions' },
    ],
  },
  paarra: {
    // deep purple into lilac
    art: {
      style: 'streak',
      colors: ['#fff4ea', '#e9a8ff', '#7061a3', '#231a40', '#3b2f63', '#ff7bca', '#fff4ea'],
      scale: 0.7,
      warp: 1.5,
      angle: -0.6,
      gloss: 0.25,
      veins: 0,
    },
    seed: 7,
    cover: '#7061a3',
    coverText: 'light',
    tone: 'light',
    files: [
      { name: 'Overview', meta: 'Architecture', image: paarraCover },
      { name: 'Multi-tenant', meta: 'Roles per workspace' },
      { name: 'Agents', meta: 'LangGraph + Redis' },
      { name: 'Multimodal', meta: 'Text · image · audio' },
    ],
  },
  'realter-crm': {
    // the brand pink, swirled with cream and a little amber
    art: {
      style: 'marble',
      colors: ['#2a0a1f', '#8a1463', '#f22fb0', '#ff7bca', '#fff4ea', '#ffc56f', '#f58a25'],
      scale: 0.72,
      warp: 3.5,
      angle: 0.9,
      gloss: 0.5,
      veins: 0.4,
    },
    seed: 12,
    cover: '#f22fb0',
    coverText: 'light',
    tone: 'light',
    files: [
      { name: 'Overview', meta: 'Architecture', image: realterCover },
      { name: 'Schema', meta: '90+ tables' },
      { name: 'Lead imports', meta: 'Queued Excel' },
      { name: 'Live updates', meta: 'WebSockets' },
    ],
  },
  next: {
    // smoked glass over coal with pink ink
    art: {
      style: 'marble',
      colors: ['#070708', '#1a1a1a', '#3a1030', '#f22fb0', '#ff7bca', '#1a1a1a', '#ffc56f'],
      scale: 0.62,
      warp: 3.2,
      angle: -0.5,
      gloss: 0.55,
      veins: 0.6,
    },
    seed: 11,
    cover: '#1a1a1a',
    coverText: 'light',
    tone: 'dark',
    files: [
      { name: 'Sketch', meta: 'In the lab', image: nextCover },
      { name: 'Agents', meta: 'In progress' },
      { name: 'Fine-tuning', meta: 'Soon' },
    ],
  },
}
