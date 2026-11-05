import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { HomePage } from '@/features/home/HomePage'
import { NotFoundPage } from './NotFoundPage'

// Every page except Home loads on demand to keep the first bundle small.
export const router = createBrowserRouter([
  // Admin CMS frontend (no auth yet): its own shell, loaded on demand.
  {
    path: '/admin',
    lazy: async () => ({
      Component: (await import('@/features/admin/layout/AdminLayout')).AdminLayout,
    }),
    children: [
      { index: true, lazy: async () => ({ Component: (await import('@/features/admin/dashboard/DashboardPage')).DashboardPage }) },
      { path: 'inquiries', lazy: async () => ({ Component: (await import('@/features/admin/inquiries/InquiriesPage')).InquiriesPage }) },
      { path: 'content', lazy: async () => ({ Component: (await import('@/features/admin/content/ContentAdminPage')).ContentAdminPage }) },
      { path: 'projects', lazy: async () => ({ Component: (await import('@/features/admin/projects/ProjectsAdminPage')).ProjectsAdminPage }) },
      { path: 'testimonials', lazy: async () => ({ Component: (await import('@/features/admin/testimonials/TestimonialsAdminPage')).TestimonialsAdminPage }) },
      { path: 'services', lazy: async () => ({ Component: (await import('@/features/admin/services/ServicesAdminPage')).ServicesAdminPage }) },
      { path: 'pricing', lazy: async () => ({ Component: (await import('@/features/admin/pricing/PricingAdminPage')).PricingAdminPage }) },
      { path: 'faqs', lazy: async () => ({ Component: (await import('@/features/admin/faqs/FaqsAdminPage')).FaqsAdminPage }) },
      { path: 'gallery', lazy: async () => ({ Component: (await import('@/features/admin/gallery/GalleryAdminPage')).GalleryAdminPage }) },
      { path: 'seo', lazy: async () => ({ Component: (await import('@/features/admin/seo/SeoAdminPage')).SeoAdminPage }) },
      { path: 'settings', lazy: async () => ({ Component: (await import('@/features/admin/settings/SettingsAdminPage')).SettingsAdminPage }) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'projects',
        lazy: async () => ({
          Component: (await import('@/features/projects/ProjectsPage'))
            .ProjectsPage,
        }),
      },
      {
        path: 'testimonials',
        lazy: async () => ({
          Component: (await import('@/features/testimonials/TestimonialsPage'))
            .TestimonialsPage,
        }),
      },
      {
        path: 'pricing',
        lazy: async () => ({
          Component: (await import('@/features/pricing/PricingPage'))
            .PricingPage,
        }),
      },
      {
        path: 'contact',
        lazy: async () => ({
          Component: (await import('@/features/contact/ContactPage'))
            .ContactPage,
        }),
      },
      {
        path: 'about-us',
        lazy: async () => ({
          Component: (await import('@/features/about/AboutUsPage')).AboutUsPage,
        }),
      },
      {
        path: 'privacy-policy',
        lazy: async () => ({
          Component: (await import('@/features/legal/PrivacyPolicyPage'))
            .PrivacyPolicyPage,
        }),
      },
      {
        path: 'terms-of-service',
        lazy: async () => ({
          Component: (await import('@/features/legal/TermsOfServicePage'))
            .TermsOfServicePage,
        }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
