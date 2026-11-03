import {
  Building2,
  CalendarCheck,
  ClipboardList,
  Code,
  Eye,
  FileText,
  Globe,
  Inbox,
  LayoutDashboard,
  Layers,
  Package,
  Puzzle,
  Rocket,
  Search,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Problem = {
  icon: LucideIcon
  title: string
  description: string
}

export const problems: readonly Problem[] = [
  {
    icon: ClipboardList,
    title: 'Manual Processes',
    description:
      'Repetitive tasks, spreadsheets, and manual coordination can slow down everyday operations.',
  },
  {
    icon: Layers,
    title: 'Disconnected Tools',
    description:
      'Important business information scattered across different platforms makes workflows harder to manage.',
  },
  {
    icon: Eye,
    title: 'Limited Visibility',
    description:
      'Without centralized information, monitoring business activities and making informed decisions becomes difficult.',
  },
  {
    icon: Inbox,
    title: 'Inefficient Customer Management',
    description:
      'Managing inquiries, appointments, customer records, and follow-ups manually can become overwhelming.',
  },
  {
    icon: Puzzle,
    title: 'Lack of Business-Specific Tools',
    description:
      'Generic software may not support the unique processes and requirements of every business.',
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
  prices: Record<Currency, string | null>
  positioning: string
  cta: string
}

export const plans: readonly Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    prices: { PHP: '₱15,000', USD: '$500' },
    positioning:
      'For landing pages, basic business websites, and simple online presence requirements.',
    cta: 'Get Started',
  },
  {
    id: 'growth',
    name: 'Growth',
    prices: { PHP: '₱75,000', USD: '$2,000' },
    positioning:
      'For booking systems, dashboards, administrative tools, and business workflow solutions.',
    cta: 'Discuss Your Project',
  },
  {
    id: 'custom',
    name: 'Custom',
    prices: { PHP: null, USD: null },
    positioning:
      'For complex business systems, inventory and sales platforms, CRM solutions, and custom web applications.',
    cta: 'Request a Quote',
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
