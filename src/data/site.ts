import { Briefcase, FlaskConical, Mail, Newspaper, User, type IconComponent } from '../icons'

export const SITE = {
  firstName: 'Shayeed',
  lastName: 'Wajee',
  title: 'Software & AI Engineer',
  email: 'shaheedwajee@gmail.com',
  cvUrl: '/Wajee_CV.pdf',
  socials: {
    linkedin: 'https://linkedin.com/in/shayeed-wajee',
    github: 'https://github.com/wajeeNPC',
    whatsapp: 'https://wa.me/94742873888',
  },
}

export type NavItem = { id: string; label: string; icon: IconComponent }

/** One entry per homepage section. The id must match the section's id attribute. */
export const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', icon: User },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'lab', label: 'Lab', icon: FlaskConical },
  { id: 'blog', label: 'Blog', icon: Newspaper },
  { id: 'contact', label: 'Contact', icon: Mail },
]
