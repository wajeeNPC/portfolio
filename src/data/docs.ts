import msmeCover from '../assets/projects/msme-rag/cover.webp'

/**
 * Pages that pull out of a Work folder when you click one of its files.
 * Keyed by project slug, then by the file's name in src/data/folders.ts.
 * A folder without an entry here keeps its files as plain previews.
 */
export type DocBlock =
  | { type: 'lead'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string }
  | { type: 'list'; items: string[] }
  /** Numbered steps, e.g. a pipeline */
  | { type: 'steps'; items: { title: string; text: string }[] }
  /** Big figures in a row */
  | { type: 'stats'; items: { value: string; label: string }[] }
  /** Label / value rows, like a spec sheet */
  | { type: 'facts'; items: { label: string; value: string }[] }
  | { type: 'image'; src: string; caption?: string }
  /** A quoted example, e.g. a question and its cited answer */
  | { type: 'example'; question: string; answer: string; source: string }

export type DocPage = {
  /** Small line at the top of the page */
  kicker: string
  title: string
  blocks: DocBlock[]
}

export const DOCS: Record<string, Record<string, DocPage>> = {
  'msme-rag': {
    Overview: {
      kicker: 'Case study',
      title: 'MSME Loan RAG',
      blocks: [
        { type: 'image', src: msmeCover, caption: 'How a question travels from the user to a cited answer.' },
        {
          type: 'lead',
          text: 'An assistant that answers questions about Sri Lankan SME loan schemes, with every answer cited back to the document and page it came from.',
        },
        { type: 'heading', text: 'The problem' },
        {
          type: 'text',
          text: 'Loan scheme details for small businesses are spread across long PDFs. Finding who is eligible, what the terms are and how to apply means reading them one by one, and a wrong answer costs real money.',
        },
        { type: 'heading', text: 'The approach' },
        {
          type: 'text',
          text: 'Retrieval-augmented generation: the scheme documents are split, embedded and stored in a vector database. For each question the most relevant passages are retrieved and the model answers only from them, citing each source.',
        },
        {
          type: 'stats',
          items: [
            { value: '33', label: 'Eval questions' },
            { value: 'Doc + page', label: 'On every citation' },
          ],
        },
      ],
    },
    'Eval set': {
      kicker: 'Evaluation',
      title: 'Measured, not guessed',
      blocks: [
        {
          type: 'lead',
          text: 'A fixed set of 33 questions with known answers, run against the assistant after every change to prompts, chunking or retrieval.',
        },
        { type: 'heading', text: 'Why a fixed set' },
        {
          type: 'text',
          text: 'Changes that look better on one question can quietly break five others. Running the same questions every time shows whether a change actually helped.',
        },
        { type: 'heading', text: 'What each answer is checked for' },
        {
          type: 'list',
          items: [
            'Correct: the answer matches what the source document says.',
            'Cited: the answer points to the right document and page.',
            'Grounded: nothing in the answer comes from outside the documents.',
            'Honest: when the documents don’t cover a question, it says so instead of guessing.',
          ],
        },
        { type: 'stats', items: [{ value: '33', label: 'Questions in the set' }] },
      ],
    },
    Citations: {
      kicker: 'Trust',
      title: 'Every answer shows its source',
      blocks: [
        {
          type: 'lead',
          text: 'Each chunk keeps the name of its document and its page number, so answers can point to exactly where the information came from.',
        },
        {
          type: 'example',
          question: 'Who can apply for this loan scheme?',
          answer: 'The answer is built only from the retrieved passages, and ends with the document and page it used.',
          source: 'Scheme guidelines.pdf · page 4',
        },
        { type: 'heading', text: 'Why it matters' },
        {
          type: 'list',
          items: [
            'Business owners can open the original document and check.',
            'Wrong answers are easy to trace back to the passage that caused them.',
            'The eval can score whether the cited page really supports the answer.',
          ],
        },
      ],
    },
    Stack: {
      kicker: 'How it’s built',
      title: 'The pipeline',
      blocks: [
        {
          type: 'steps',
          items: [
            { title: 'Load', text: 'Read the scheme PDFs page by page, keeping document names and page numbers.' },
            { title: 'Split', text: 'Break pages into overlapping chunks small enough to retrieve precisely.' },
            { title: 'Embed & store', text: 'Turn chunks into embeddings and store them in Chroma with their metadata.' },
            { title: 'Retrieve', text: 'Find the passages closest to the question.' },
            { title: 'Answer', text: 'Generate an answer from those passages only, with citations.' },
            { title: 'Evaluate', text: 'Run the 33-question set to check every change.' },
          ],
        },
        {
          type: 'facts',
          items: [
            { label: 'Language', value: 'Python' },
            { label: 'Orchestration', value: 'LangChain' },
            { label: 'Vector store', value: 'Chroma' },
            { label: 'Models', value: 'OpenAI, Hugging Face' },
          ],
        },
      ],
    },
  },
}
