import {
  Building2,
  CalendarCheck,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Code,
  Eye,
  FileText,
  Globe,
  Inbox,
  LayoutDashboard,
  Layers,
  MessagesSquare,
  Package,
  Puzzle,
  Rocket,
  Search,
  Users,
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

export type PricingNote = {
  icon: LucideIcon
  title: string
  description: string
}

export const pricingNotes: readonly PricingNote[] = [
  {
    icon: ClipboardCheck,
    title: 'Scoped to fit',
    description: 'Starting prices are a guide. Your final quote follows scoping.',
  },
  {
    icon: Clock,
    title: 'Timeline per project',
    description: 'We confirm the timeline individually for every scope.',
  },
  {
    icon: Wrench,
    title: 'Optional maintenance',
    description: 'Ongoing maintenance is optional and quoted separately.',
  },
]

export type ShowcaseProject = {
  id: string
  title: string
  category: string
  summary: string
  details: string
  features: readonly string[]
  image: { src: string; alt: string }
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

export const showcaseProjects: readonly ShowcaseProject[] = [
  {
    id: 'clinic-booking',
    title: 'Clinic Booking System',
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
    url: PLACEHOLDER_URL,
  },
  {
    id: 'inventory-sales',
    title: 'Inventory and Sales Tracker',
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
    url: PLACEHOLDER_URL,
  },
  {
    id: 'operations-dashboard',
    title: 'Operations Dashboard',
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
    url: PLACEHOLDER_URL,
  },
  {
    id: 'retail-crm',
    title: 'Retail Customer CRM',
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
    url: PLACEHOLDER_URL,
  },
  {
    id: 'coworking-website',
    title: 'Coworking Space Website',
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
    url: PLACEHOLDER_URL,
  },
  {
    id: 'business-management',
    title: 'Business Management System',
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
    url: PLACEHOLDER_URL,
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
  question: string
  answer: string
}

export const faqs: readonly Faq[] = [
  {
    question: 'What types of businesses do you work with?',
    answer:
      'We work with startups and businesses that need custom websites, web applications, or digital systems to support their operations and goals.',
  },
  {
    question: 'Can you build a system based on our existing workflow?',
    answer:
      'Yes. We first understand your current processes and requirements, then determine an appropriate solution based on your business needs and agreed project scope.',
  },
  {
    question: 'How much does a project cost?',
    answer:
      'Project pricing depends on the type of solution, features, complexity, and overall scope. Our pricing section provides starting prices, while custom requirements are quoted individually.',
  },
  {
    question: 'How long does development take?',
    answer:
      'Development time depends on project requirements, complexity, and scope. We provide an estimated timeline during the proposal stage.',
  },
  {
    question: 'Do you provide maintenance after launch?',
    answer:
      'Maintenance is optional and can be arranged separately based on your requirements.',
  },
  {
    question: 'Who owns the completed project?',
    answer:
      'Ownership of agreed custom deliverables is transferred to the client after full payment, subject to the agreed terms and applicable third-party licenses.',
  },
  {
    question: 'How do we start a project?',
    answer:
      'You can submit your project details through our contact form. We will use the information to understand your requirements and discuss the next steps.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      'Yes. Ordacy is open to working with both Philippine and international clients.',
  },
]
