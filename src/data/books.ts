import aiEngineering from '../assets/books/ai-engineering.jpg'
import buildLlm from '../assets/books/build-llm-from-scratch.jpg'
import ddia from '../assets/books/ddia.jpg'
import deepLearningPython from '../assets/books/deep-learning-python.jpg'
import pragmaticProgrammer from '../assets/books/pragmatic-programmer.jpg'
import atomicHabits from '../assets/books/atomic-habits.jpg'

/**
 * Books in the carousel, in order. The first one starts in the centre.
 * Covers live in src/assets/books (portrait, roughly 2:3).
 */
export type Book = {
  title: string
  author: string
  /** reading = on it now, finished = done, not-yet = on the list */
  status: 'reading' | 'finished' | 'not-yet'
  /** One line on why it's on the shelf */
  note: string
  cover: string
}

export const BOOKS: Book[] = [
  {
    title: 'AI Engineering',
    author: 'Chip Huyen',
    status: 'reading',
    note: 'Building real products on top of foundation models.',
    cover: aiEngineering,
  },
  {
    title: 'Build a Large Language Model (From Scratch)',
    author: 'Sebastian Raschka',
    status: 'not-yet',
    note: 'Writing a GPT-style model step by step to see how it works.',
    cover: buildLlm,
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    status: 'not-yet',
    note: 'How databases, queues and caches really behave under load.',
    cover: ddia,
  },
  {
    title: 'Deep Learning with Python',
    author: 'François Chollet',
    status: 'not-yet',
    note: 'The intuition behind neural networks, with code.',
    cover: deepLearningPython,
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    status: 'not-yet',
    note: 'Habits that make code easier to live with.',
    cover: pragmaticProgrammer,
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'not-yet',
    note: 'Small systems that keep the learning going.',
    cover: atomicHabits,
  },
]
