import { motion, useReducedMotion } from 'motion/react'
import { BookCheck, BookOpen, Bookmark, type IconComponent } from '../../icons'
import { CoverflowCarousel, type CoverflowSlide } from '../ui/coverflow-carousel'
import { BOOKS, type Book } from '../../data/books'

// Tag shown above each book's title
const STATUS: Record<Book['status'], { label: string; icon: IconComponent; color: string }> = {
  reading: { label: 'Reading now', icon: BookOpen, color: 'text-accent' },
  finished: { label: 'Finished', icon: BookCheck, color: 'text-muted' },
  'not-yet': { label: 'Not read yet', icon: Bookmark, color: 'text-muted' },
}

/**
 * Books as a 3D cover carousel. The book in the centre shows its status, author and note below.
 * Drag, flick, use the arrows or the dots (arrows and dots appear once there's more than one book).
 */
function Bookshelf({ books = BOOKS }: { books?: Book[] }) {
  const reduceMotion = useReducedMotion()
  const several = books.length > 1

  const slides: CoverflowSlide[] = books.map((book) => {
    const { label, icon: Icon, color } = STATUS[book.status]
    return {
      src: book.cover,
      alt: `Cover of ${book.title} by ${book.author}`,
      title: book.title,
      subtitle: book.author,
      badge: label,
      badgeIcon: <Icon aria-hidden="true" className={`size-3.5 ${color}`} strokeWidth={2.2} />,
      description: book.note,
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <CoverflowCarousel
        slides={slides}
        label="Books I'm reading"
        cardWidth="clamp(160px, 18vw, 230px)"
        // Close to a book's shape, so the cover fills the card with little cropping
        aspect={1.4}
        cardClassName="rounded-2xl"
        // Looping a single card would fade it out, so only loop once there are a few
        loop={books.length > 2}
        showCaption
        showNavigation={several}
        showPagination={several}
      />
    </motion.div>
  )
}

export default Bookshelf
