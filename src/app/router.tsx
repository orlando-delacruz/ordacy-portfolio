import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { AboutUsPage } from '@/features/about/AboutUsPage'
import { ContactPage } from '@/features/contact/ContactPage'
import { HomePage } from '@/features/home/HomePage'
import { PrivacyPolicyPage } from '@/features/legal/PrivacyPolicyPage'
import { TermsOfServicePage } from '@/features/legal/TermsOfServicePage'
import { PricingPage } from '@/features/pricing/PricingPage'
import { ProjectsPage } from '@/features/projects/ProjectsPage'
import { TestimonialsPage } from '@/features/testimonials/TestimonialsPage'
import { NotFoundPage } from './NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'testimonials', element: <TestimonialsPage /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'about-us', element: <AboutUsPage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-of-service', element: <TermsOfServicePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
