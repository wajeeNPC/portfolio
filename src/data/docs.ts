import msmeCover from '../assets/projects/msme-rag/cover.webp'
import msmeReport from '../project_pdf/msme-rag-case-study.pdf?url'

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
  /** A small table. `highlight` marks one row (by index), e.g. the winner */
  | { type: 'table'; columns: string[]; rows: string[][]; highlight?: number; caption?: string }
  /** Horizontal bars on a zero-based scale; `display` is the printed value */
  | { type: 'bars'; items: { label: string; value: number; display: string }[]; caption?: string }
  /** Before → after figures for one change */
  | { type: 'shift'; items: { label: string; from: string; to: string }[] }
  /** A highlighted callout */
  | { type: 'note'; text: string }
  /** A file the reader can open */
  | { type: 'download'; label: string; href: string; meta?: string }

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
      title: 'What actually improves a RAG system?',
      blocks: [
        { type: 'image', src: msmeCover, caption: 'How a question travels from the user to a cited answer.' },
        {
          type: 'lead',
          text: 'I built an assistant that answers questions about Sri Lankan government loan schemes for small businesses. Then I tested 11 versions of it to find out what actually makes it better.',
        },
        { type: 'heading', text: 'The problem' },
        {
          type: 'text',
          text: 'The rules for these loans are buried in official PDFs. To find out who can apply, what the interest rate is or how to apply, a business owner has to read them one by one, and a wrong answer costs real money.',
        },
        { type: 'heading', text: 'Three rules the assistant follows' },
        {
          type: 'list',
          items: [
            'Answer only from three official documents: a Treasury FAQ, an operating guideline and a schemes summary.',
            'Cite the document and page for every claim, so anyone can check it.',
            'If the documents don’t cover it, say “I do not know” instead of guessing.',
          ],
        },
        { type: 'heading', text: 'The best version' },
        {
          type: 'stats',
          items: [
            { value: '4.70 / 5', label: 'Accuracy' },
            { value: '4.51 / 5', label: 'Completeness' },
            { value: '6.5k', label: 'Tokens per question' },
            { value: '61% fewer', label: 'Tokens than putting every page in the prompt' },
          ],
        },
        {
          type: 'download',
          label: 'Read the full report',
          href: msmeReport,
          meta: 'PDF · 6 pages · every setup, score and limitation',
        },
      ],
    },
    'How it works': {
      kicker: 'Pipeline',
      title: 'From PDF to cited answer',
      blocks: [
        {
          type: 'lead',
          text: 'The three documents are small enough to fit in one prompt, so the simplest option is a fair rival. I compared three ways of answering.',
        },
        {
          type: 'table',
          columns: ['Approach', 'How it works', 'Tokens / question'],
          rows: [
            ['Baseline', 'Every page goes into the prompt. No search.', '16.8k'],
            ['RAG v1', 'Fixed-size chunks, the 10 closest are sent to the model.', '3.6k'],
            ['RAG Pro', 'Cleaned pages, LLM-made chunks, optional reranking.', '2.4k – 6.5k'],
          ],
          highlight: 2,
        },
        { type: 'heading', text: 'How RAG Pro reads the documents' },
        {
          type: 'steps',
          items: [
            { title: 'Clean', text: 'Strip menus, headers, footers and page numbers from each page.' },
            { title: 'Chunk page by page', text: 'An LLM splits each page, keeping table rows whole with their column headers, so every chunk keeps its true page number.' },
            { title: 'Add a headline and summary', text: 'Stored with the original text, so questions find the right chunk more easily.' },
            { title: 'Safety check', text: 'Reject any chunk with numbers that aren’t on the page, or less than 95% of its text from the page.' },
            { title: 'Embed and store', text: 'Source and page are kept as metadata, ready to become citations.' },
          ],
        },
        { type: 'note', text: 'Why the safety check matters: a chunker that silently turns an 8% rate into 6% would produce confident, wrong answers.' },
        { type: 'heading', text: 'How it answers a question' },
        {
          type: 'steps',
          items: [
            { title: 'Search', text: 'Find the 20 chunks closest to the question.' },
            { title: 'Rerank', text: 'A small LLM puts them in order; the top 10 move on.' },
            { title: 'Label', text: 'Each chunk is tagged with its document and page.' },
            { title: 'Answer', text: 'The model answers from those chunks only and cites each claim, or says it doesn’t know.' },
          ],
        },
        { type: 'heading', text: 'Real answers from the best run' },
        {
          type: 'example',
          question: 'Which scheme is cheapest in interest?',
          answer:
            'The cheapest MSME loan scheme in terms of maximum interest rate is the Component I (Re-energizing MSME) scheme, which has a maximum interest rate of 7% per annum. For comparison, SMELoC has a maximum of 10%, SMELOC2 8%, and Component II (Re-energizing MSME, NPL) 8%.',
          source: 'Schemes summary p.2 · Operating guideline p.3 · scored 5/5',
        },
        {
          type: 'example',
          question: 'Can I get a loan under the “Rural Women Entrepreneur Loan Scheme”?',
          answer:
            'I don’t have information about a specific “Rural Women Entrepreneur Loan Scheme” in the provided documents. Please check with the bank or the Department of Development Finance for details on this scheme.',
          source: 'Not in the documents, so it declines · scored 5/5',
        },
        { type: 'heading', text: 'Built with' },
        {
          type: 'facts',
          items: [
            { label: 'Language', value: 'Python' },
            { label: 'Orchestration', value: 'LangChain' },
            { label: 'Vector store', value: 'Chroma' },
            { label: 'Answer models', value: 'gpt-4.1-nano, gpt-4.1-mini' },
            { label: 'Embeddings', value: 'text-embedding-3-large, MiniLM' },
            { label: 'Judge', value: 'gpt-4.1' },
          ],
        },
      ],
    },
    Findings: {
      kicker: '11 setups · 33 questions',
      title: 'Three things that surprised me',
      blocks: [
        {
          type: 'lead',
          text: 'Every setup answered the same 33 questions. Search and answers were scored separately, so each change could be judged on its own.',
        },
        { type: 'heading', text: '1. Better search didn’t mean better answers' },
        {
          type: 'shift',
          items: [
            { label: 'Search score (MRR)', from: '0.64', to: '0.81' },
            { label: 'Answer accuracy', from: '4.30', to: '4.30' },
          ],
        },
        {
          type: 'text',
          text: 'Cleaning the pages and letting an LLM chunk them found the right page far more often, and the embedding model was ruled out as the cause. But the same questions kept failing even with the right pages in hand. The weak point had moved from search to the answer step.',
        },
        { type: 'heading', text: '2. The answer model mattered most' },
        {
          type: 'shift',
          items: [
            { label: 'Completeness, nano → mini', from: '4.03', to: '4.39' },
            { label: 'Tokens per question', from: '2,360', to: '2,394' },
          ],
        },
        {
          type: 'text',
          text: 'Same search, almost the same cost, only a stronger model writing the answer. It also beat the weaker model with reranking while using 37% of the tokens.',
        },
        { type: 'heading', text: '3. Rewriting the question made search worse' },
        {
          type: 'shift',
          items: [{ label: 'Search score (MRR)', from: '0.81', to: '0.58' }],
        },
        {
          type: 'list',
          items: [
            'The rewrite prompt listed scheme names as examples, and the model copied them into questions that never mentioned a scheme.',
            'Results were merged by raw distance, so the longer, rewritten query pushed out the original’s better matches.',
            'Rewriting is built for follow-up questions, and these were all single questions.',
          ],
        },
        {
          type: 'text',
          text: 'So rewriting failed as I built it, not necessarily as an idea. A negative result is still a result.',
        },
        { type: 'heading', text: 'What it costs' },
        {
          type: 'bars',
          items: [
            { label: 'Every page in the prompt', value: 16785, display: '16,785' },
            { label: 'RAG Pro + rerank (best)', value: 6473, display: '6,473' },
            { label: 'RAG Pro, no rerank', value: 2394, display: '2,394' },
          ],
          caption: 'Tokens per question. Reranking added +0.18 accuracy for about 2.7× the tokens.',
        },
        { type: 'heading', text: 'All 11 setups' },
        {
          type: 'table',
          columns: ['Setup (answer model)', 'Search MRR', 'Accuracy', 'Tokens'],
          rows: [
            ['Baseline, all pages (nano)', '–', '4.24', '16,785'],
            ['RAG v1, 500-char chunks (nano)', '0.63', '3.82', '1,796'],
            ['RAG v1, 1500-char chunks (nano)', '0.64', '4.30', '3,610'],
            ['RAG v1, OpenAI embeddings (nano)', '0.64', '4.30', '3,675'],
            ['RAG Pro (nano)', '0.81', '4.30', '2,360'],
            ['RAG Pro + rewrite (nano)', '0.58', '4.27', '3,047'],
            ['RAG Pro + rewrite + rerank (nano)', '0.73', '4.33', '8,895'],
            ['RAG Pro + rerank (nano)', '0.88', '4.49', '6,473'],
            ['RAG Pro (mini)', '0.81', '4.51', '2,394'],
            ['RAG Pro + rewrite (mini)', '0.58', '4.46', '3,025'],
            ['RAG Pro + rerank (mini)', '0.88', '4.70', '6,473'],
          ],
          highlight: 10,
          caption: 'Accuracy is scored 1 to 5 by gpt-4.1 against a reference answer.',
        },
      ],
    },
    'How I measured': {
      kicker: 'Evaluation',
      title: 'Measured, not guessed',
      blocks: [
        {
          type: 'lead',
          text: 'A fixed set of hand-written questions, each with the pages it should come from, key words to look for and a reference answer.',
        },
        {
          type: 'stats',
          items: [
            { value: '33', label: 'Questions' },
            { value: '27', label: 'Answerable from the documents' },
            { value: '6', label: 'Where the right answer is “I do not know”' },
            { value: '11', label: 'Setups compared' },
          ],
        },
        { type: 'heading', text: 'Two kinds of score' },
        {
          type: 'list',
          items: [
            'Search: plain Python, no AI. Did the expected page show up in the top 10, and how high? (MRR, nDCG, coverage)',
            'Answers: gpt-4.1 compares each answer with the reference and scores accuracy, completeness and relevance from 1 to 5.',
          ],
        },
        { type: 'heading', text: 'Which gains are real?' },
        {
          type: 'text',
          text: 'With 33 questions, one question moves a score by about 0.03. I resampled the questions 5,000 times to see which differences hold up and which could be noise.',
        },
        {
          type: 'table',
          columns: ['Change', 'Score', 'Gain', 'Verdict'],
          rows: [
            ['Stronger answer model', 'Completeness', '+0.36', 'Likely real'],
            ['Stronger answer model', 'Accuracy', '+0.21', 'Not proven'],
            ['Rerank (strong model)', 'Accuracy', '+0.18', 'Likely real'],
            ['Rerank (weak model)', 'Accuracy', '+0.18', 'Not proven'],
            ['Rerank (weak model)', 'Completeness', '+0.03', 'No effect'],
          ],
          caption: '95% intervals from bootstrapping. “Not proven” means the interval includes zero.',
        },
        { type: 'heading', text: 'Where it still fails' },
        {
          type: 'list',
          items: [
            'Citizenship: the documents require it for one scheme only, and the models apply it to all of them.',
            '“Is the scheme still open?”: the documents give dates up to 1 May 2026 but say nothing about extensions.',
            'Saying “I do not know”: stronger models answer more readily, and refusal accuracy dropped from 5.0 to about 4.0.',
          ],
        },
        {
          type: 'example',
          question: 'Do I have to be a Sri Lankan citizen?',
          answer:
            'Yes, to be eligible for the loan under the MSME scheme, you must be a citizen of Sri Lanka.',
          source: 'Operating guideline p.4 · scored 3/5: true for one scheme, not all',
        },
        { type: 'heading', text: 'Honest limits' },
        {
          type: 'list',
          items: [
            'A small test set, and each setup was run once.',
            'Setups were tuned on the same questions they were scored on; there is no held-out set yet.',
            'The baseline only ran with the weaker model, so “RAG beats no RAG” isn’t proven yet.',
            'One LLM judge scored every answer, and its bias wasn’t measured.',
          ],
        },
        { type: 'heading', text: 'What I’d test next' },
        {
          type: 'list',
          items: [
            'The baseline with the stronger model.',
            'A fixed rewrite prompt with rank-based merging.',
            'Repeat runs and new held-out questions.',
            'Table-aware PDF parsing for the schemes table.',
          ],
        },
      ],
    },
  },
}
