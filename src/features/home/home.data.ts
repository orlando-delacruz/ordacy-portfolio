import {
  Building2,
  CalendarCheck,
  ClipboardList,
  Clock,
  Code,
  Eye,
  FileText,
  Globe,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Layers,
  MessagesSquare,
  Package,
  Puzzle,
  Rocket,
  Search,
  Users,
  Wallet,
  Workflow,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Problem = {
  icon: LucideIcon
  title: string
  description: string
  /** Titles of the `services` entries that address this problem. */
  solvedBy: readonly string[]
}

export const problems: readonly Problem[] = [
  {
    icon: ClipboardList,
    title: 'Manual Processes',
    description:
      'Repetitive tasks, spreadsheets, and manual coordination can slow down everyday operations.',
    solvedBy: [
      'Custom Business Management Systems',
      'Internal Dashboards and Admin Tools',
    ],
  },
  {
    icon: Layers,
    title: 'Disconnected Tools',
    description:
      'Important business information scattered across different platforms makes workflows harder to manage.',
    solvedBy: [
      'Custom Business Management Systems',
      'CRM and Customer Management Systems',
    ],
  },
  {
    icon: Eye,
    title: 'Limited Visibility',
    description:
      'Without centralized information, monitoring business activities and making informed decisions becomes difficult.',
    solvedBy: [
      'Internal Dashboards and Admin Tools',
      'Inventory and Sales Systems',
    ],
  },
  {
    icon: Inbox,
    title: 'Inefficient Customer Management',
    description:
      'Managing inquiries, appointments, customer records, and follow-ups manually can become overwhelming.',
    solvedBy: [
      'CRM and Customer Management Systems',
      'Booking and Scheduling Systems',
    ],
  },
  {
    icon: Puzzle,
    title: 'Lack of Business-Specific Tools',
    description:
      'Generic software may not support the unique processes and requirements of every business.',
    solvedBy: [
      'Custom Business Management Systems',
      'Custom Websites and Web Applications',
    ],
  },
]

export type Service = {
  icon: LucideIcon
  title: string
  description: string
}

export const services: readonly Service[] = [
  {
    icon: Building2,
    title: 'Custom Business Management Systems',
    description:
      'Centralize your business operations with systems designed around your workflows, processes, and management needs.',
  },
  {
    icon: CalendarCheck,
    title: 'Booking and Scheduling Systems',
    description:
      'Manage appointments, reservations, schedules, and customer bookings through an organized digital platform.',
  },
  {
    icon: LayoutDashboard,
    title: 'Internal Dashboards and Admin Tools',
    description:
      'Manage information, monitor business activities, and handle everyday operations through dedicated administrative tools.',
  },
  {
    icon: Package,
    title: 'Inventory and Sales Systems',
    description:
      'Organize products, inventory records, sales transactions, and essential business information.',
  },
  {
    icon: Globe,
    title: 'Custom Websites and Web Applications',
    description:
      'Build a professional online presence or web application designed around your business objectives.',
  },
  {
    icon: Users,
    title: 'CRM and Customer Management Systems',
    description:
      'Organize customer information, inquiries, interactions, and follow-up workflows.',
  },
]

export type Currency = 'PHP' | 'USD'

export type Plan = {
  id: string
  name: string
  icon: LucideIcon
  category: string
  prices: Record<Currency, string | null>
  positioning: string
  fits: readonly string[]
  cta: string
  ctaIcon: LucideIcon
}

export const plans: readonly Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Globe,
    category: 'Websites',
    prices: { PHP: '₱10,000', USD: '$500' },
    positioning: 'For websites and a simple online presence.',
    fits: ['Landing pages', 'Basic business websites', 'Simple online presence'],
    cta: 'Get Started',
    ctaIcon: Rocket,
  },
  {
    id: 'growth',
    name: 'Growth',
    icon: LayoutDashboard,
    category: 'Business systems',
    prices: { PHP: '₱40,000', USD: '$2,000' },
    positioning: 'For booking, dashboards, and workflow tools.',
    fits: [
      'Booking systems',
      'Dashboards',
      'Administrative tools',
      'Business workflow solutions',
    ],
    cta: 'Discuss Your Project',
    ctaIcon: MessagesSquare,
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: Building2,
    category: 'Complex builds',
    prices: { PHP: null, USD: null },
    positioning: 'For complex, fully custom business systems.',
    fits: [
      'Complex business systems',
      'Inventory and sales platforms',
      'CRM solutions',
      'Custom web applications',
    ],
    cta: 'Request a Quote',
    ctaIcon: FileText,
  },
]

export type ProjectShot = {
  src: string
  alt: string
}

export type ShowcaseProject = {
  id: string
  title: string
  /** Shown in the card's category badge. */
  icon: LucideIcon
  category: string
  summary: string
  details: string
  features: readonly string[]
  image: ProjectShot
  /** Extra screenshots shown as thumbnails under the main image in the details dialog. */
  screenshots: readonly ProjectShot[]
  /** Live site for the "Visit website" button. */
  url: string
}

// PLACEHOLDER CONTENT, replace before launch. These projects are illustrative,
// not real client work, and every `url` points to example.com. Publishing them
// as-is would present fictional work as real. Swap in approved client projects
// (with permission) and their live URLs. Photos: Unsplash (free license).
const PLACEHOLDER_URL = 'https://example.com'
const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`

// Placeholder screenshots (picsum seeds, deterministic). Replace with real
// product screenshots per project before launch; `image` stays the thumbnail.
const shots = (seed: string, title: string) =>
  [1, 2, 3].map((index) => ({
    src: `https://picsum.photos/seed/${seed}-${index}/1200/750`,
    alt: `${title} screenshot ${index}.`,
  }))

export const showcaseProjects: readonly ShowcaseProject[] = [
  {
    id: 'clinic-booking',
    title: 'Clinic Booking System',
    icon: CalendarCheck,
    category: 'Booking and Scheduling',
    summary:
      'Online appointments, staff schedules, and patient reminders in one place.',
    details:
      'A booking platform for a small clinic. Patients pick a service and an open time slot, staff manage daily schedules from one calendar, and the front desk sees every upcoming appointment at a glance.',
    features: [
      'Online booking',
      'Staff calendar',
      'Appointment reminders',
      'Patient records',
    ],
    image: {
      src: unsplash('photo-1576091160550-2173dba999ef'),
      alt: 'Hands typing on a laptop next to a stethoscope on a desk.',
    },
    screenshots: shots('clinic-booking', 'Clinic Booking System'),
    url: PLACEHOLDER_URL,
  },
  {
    id: 'inventory-sales',
    title: 'Inventory and Sales Tracker',
    icon: Package,
    category: 'Inventory and Sales',
    summary:
      'Stock levels, product records, and daily sales tracked in real time.',
    details:
      'An inventory system for a growing retailer. Each product has one record, stock updates as sales are logged, and low-stock items are flagged before they run out.',
    features: [
      'Product catalog',
      'Stock tracking',
      'Sales logging',
      'Low-stock alerts',
    ],
    image: {
      src: unsplash('photo-1586528116311-ad8dd3c8310d'),
      alt: 'A warehouse with rows of shelves stacked with boxes and crates.',
    },
    screenshots: shots('inventory-sales', 'Inventory and Sales Tracker'),
    url: PLACEHOLDER_URL,
  },
  {
    id: 'operations-dashboard',
    title: 'Operations Dashboard',
    icon: LayoutDashboard,
    category: 'Dashboards and Admin Tools',
    summary:
      'Key business numbers and team activity on a single admin screen.',
    details:
      'An admin dashboard that pulls daily activity into one view. Managers check key figures, filter by date range, and spot trends without exporting spreadsheets.',
    features: [
      'Live summary cards',
      'Date-range filters',
      'Trend charts',
      'Role-based access',
    ],
    image: {
      src: unsplash('photo-1551288049-bebda4e38f71'),
      alt: 'A laptop screen showing analytics charts and graphs.',
    },
    screenshots: shots('operations-dashboard', 'Operations Dashboard'),
    url: PLACEHOLDER_URL,
  },
  {
    id: 'retail-crm',
    title: 'Retail Customer CRM',
    icon: Users,
    category: 'CRM and Customer Management',
    summary:
      'Customer profiles, purchase history, and follow-ups for a retail team.',
    details:
      'A customer management system for a retail shop. Staff look up a customer at checkout, see past purchases, and schedule follow-ups so no inquiry is forgotten.',
    features: [
      'Customer profiles',
      'Purchase history',
      'Follow-up tasks',
      'Inquiry tracking',
    ],
    image: {
      src: unsplash('photo-1556742049-0cfed4f6a45d'),
      alt: 'A shop assistant serving a customer who pays with a phone at the counter.',
    },
    screenshots: shots('retail-crm', 'Retail Customer CRM'),
    url: PLACEHOLDER_URL,
  },
  {
    id: 'coworking-website',
    title: 'Coworking Space Website',
    icon: Globe,
    category: 'Websites and Web Apps',
    summary:
      'A fast, mobile-first website with membership plans and tour bookings.',
    details:
      'A marketing website for a coworking space. Visitors compare membership plans, browse the space, and book a tour, all from a site built to load quickly on any phone.',
    features: [
      'Membership plans',
      'Tour booking',
      'Mobile-first design',
      'Easy content updates',
    ],
    image: {
      src: unsplash('photo-1522202176988-66273c2fd55f'),
      alt: 'Three people working on laptops and talking at a shared table.',
    },
    screenshots: shots('coworking-website', 'Coworking Space Website'),
    url: PLACEHOLDER_URL,
  },
  {
    id: 'business-management',
    title: 'Business Management System',
    icon: Building2,
    category: 'Business Management',
    summary:
      'Tasks, approvals, and team records unified in one internal system.',
    details:
      'An internal management system for a services company. Teams track tasks, route approvals, and keep records in one place instead of across scattered spreadsheets.',
    features: [
      'Task management',
      'Approval workflows',
      'Team records',
      'Activity history',
    ],
    image: {
      src: unsplash('photo-1553877522-43269d4ea984'),
      alt: 'A team member presenting on a laptop to colleagues in an office.',
    },
    screenshots: shots('business-management', 'Business Management System'),
    url: PLACEHOLDER_URL,
  },
]

export type Testimonial = {
  id: string
  /** The client's own words. Keep to ~2–4 sentences so cards stay even. */
  quote: string
  name: string
  /** Role at the company, e.g. "Operations Manager". */
  role: string
  company: string
  /** 1–5. Rendered as stars; keep whole numbers. */
  rating: number
  /** 1–2 letters shown in the avatar when there is no photo. */
  initials: string
}

// PLACEHOLDER CONTENT, replace before launch. These testimonials are
// illustrative, NOT real client feedback, and every name/company is invented.
// Publishing them as-is would present fabricated endorsements as genuine.
// Per README content rules, only publish real testimonials collected with the
// client's permission. Swap in approved quotes (and their real attribution)
// before this section goes live.
export const testimonials: readonly Testimonial[] = [
  {
    id: 'placeholder-1',
    quote:
      'The booking system they built replaced three spreadsheets and a shared inbox. Our front desk now sees every appointment in one place, and no-shows have dropped noticeably.',
    name: 'Placeholder Name',
    role: 'Operations Manager',
    company: 'Example Clinic',
    rating: 5,
    initials: 'PN',
  },
  {
    id: 'placeholder-2',
    quote:
      'We went from guessing our stock levels to knowing them in real time. The inventory dashboard flags low items before they run out, which has saved us more than one lost sale.',
    name: 'Placeholder Name',
    role: 'Owner',
    company: 'Example Retail',
    rating: 5,
    initials: 'PN',
  },
  {
    id: 'placeholder-3',
    quote:
      'They took the time to understand how we actually work before writing a line of code. The result fits our process instead of forcing us to fit theirs.',
    name: 'Placeholder Name',
    role: 'Managing Director',
    company: 'Example Services Co.',
    rating: 5,
    initials: 'PN',
  },
  {
    id: 'placeholder-4',
    quote:
      'Our team used to lose hours each week to manual reporting. The admin dashboard pulls everything into one screen, so decisions happen faster and with better information.',
    name: 'Placeholder Name',
    role: 'Head of Operations',
    company: 'Example Group',
    rating: 5,
    initials: 'PN',
  },
  {
    id: 'placeholder-5',
    quote:
      'Clear communication from discovery through handover. Timelines were realistic, updates were regular, and the finished system worked exactly as scoped.',
    name: 'Placeholder Name',
    role: 'Founder',
    company: 'Example Studio',
    rating: 5,
    initials: 'PN',
  },
  {
    id: 'placeholder-6',
    quote:
      'The CRM they delivered keeps every customer interaction in one place. Follow-ups no longer slip through the cracks, and the whole team can pick up where anyone left off.',
    name: 'Placeholder Name',
    role: 'Sales Lead',
    company: 'Example Agency',
    rating: 5,
    initials: 'PN',
  },
]

export type Step = {
  icon: LucideIcon
  title: string
  description: string
}

export const steps: readonly Step[] = [
  {
    icon: Search,
    title: 'Discovery',
    description:
      'We learn about your business, current processes, challenges, and goals.',
  },
  {
    icon: FileText,
    title: 'Proposal and Scope',
    description:
      'We define the proposed solution, features, project scope, timeline, and investment.',
  },
  {
    icon: Code,
    title: 'Design and Development',
    description:
      'We design and build the solution based on the approved requirements.',
  },
  {
    icon: Rocket,
    title: 'Testing and Handover',
    description:
      'We review functionality, address agreed issues, and prepare the completed project for handover.',
  },
]

export type Faq = {
  icon: LucideIcon
  question: string
  answer: string
  /** Shown in the home page FAQ section (keep to five). */
  featured?: boolean
}

export const faqs: readonly Faq[] = [
  {
    icon: Building2,
    featured: true,
    question: 'What types of businesses do you work with?',
    answer:
      'We work with startups and businesses that need custom websites, web applications, or digital systems to support their operations and goals.',
  },
  {
    icon: Workflow,
    featured: true,
    question: 'Can you build a system based on our existing workflow?',
    answer:
      'Yes. We first understand your current processes and requirements, then determine an appropriate solution based on your business needs and agreed project scope.',
  },
  {
    icon: Wallet,
    featured: true,
    question: 'How much does a project cost?',
    answer:
      'Project pricing depends on the type of solution, features, complexity, and overall scope. Our pricing section provides starting prices, while custom requirements are quoted individually.',
  },
  {
    icon: Clock,
    featured: true,
    question: 'How long does development take?',
    answer:
      'Development time depends on project requirements, complexity, and scope. We provide an estimated timeline during the proposal stage.',
  },
  {
    icon: Wrench,
    question: 'Do you provide maintenance after launch?',
    answer:
      'Maintenance is optional and can be arranged separately based on your requirements.',
  },
  {
    icon: KeyRound,
    question: 'Who owns the completed project?',
    answer:
      'Ownership of agreed custom deliverables is transferred to the client after full payment, subject to the agreed terms and applicable third-party licenses.',
  },
  {
    icon: Rocket,
    featured: true,
    question: 'How do we start a project?',
    answer:
      'You can submit your project details through our contact form. We will use the information to understand your requirements and discuss the next steps.',
  },
  {
    icon: Globe,
    question: 'Do you work with international clients?',
    answer:
      'Yes. Ordacy is open to working with both Philippine and international clients.',
  },
]
