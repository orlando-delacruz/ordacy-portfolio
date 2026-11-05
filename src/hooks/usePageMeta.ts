import { useEffect } from 'react'
import { services, site } from '@/data'
import type { PageSeo } from '@/data'

type TagSpec = { selector: string; attrs: Record<string, string> }

function upsert(tag: 'meta' | 'link', spec: TagSpec, key: string, value: string) {
  let element = document.head.querySelector<HTMLElement>(spec.selector)
  const created = !element
  if (!element) {
    element = document.createElement(tag)
    for (const [name, attr] of Object.entries(spec.attrs)) {
      element.setAttribute(name, attr)
    }
    document.head.appendChild(element)
  }
  const previous = element.getAttribute(key)
  element.setAttribute(key, value)
  return () => {
    if (created) element.remove()
    else if (previous !== null) element.setAttribute(key, previous)
  }
}

const meta = (name: string, attr: 'name' | 'property'): TagSpec => ({
  selector: `meta[${attr}="${name}"]`,
  attrs: { [attr]: name },
})

/** Sets title, description, Open Graph, canonical and robots for a page; restores on unmount. */
/** Organization JSON-LD built only from confirmed site fields. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    areaServed: site.markets,
    knowsAbout: services.map((service) => service.title),
    ...(site.siteUrlPending ? {} : { url: site.siteUrl }),
    ...(site.contact.email.value ? { email: site.contact.email.value } : {}),
  }
}

export function usePageMeta({
  title,
  description,
  path,
  noindex,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  structuredData,
}: PageSeo & { structuredData?: object }) {
  useEffect(() => {
    const previousTitle = document.title
    const url =
      path === '*'
        ? null
        : (canonical ?? new URL(path, site.siteUrl).toString())
    document.title = title

    const restore = [
      upsert('meta', meta('description', 'name'), 'content', description),
      upsert('meta', meta('og:title', 'property'), 'content', ogTitle ?? title),
      upsert(
        'meta',
        meta('og:description', 'property'),
        'content',
        ogDescription ?? description,
      ),
      upsert('meta', meta('og:type', 'property'), 'content', 'website'),
      upsert('meta', meta('og:site_name', 'property'), 'content', site.name),
    ]
    if (ogImage) {
      restore.push(upsert('meta', meta('og:image', 'property'), 'content', ogImage))
    }
    if (url) {
      restore.push(
        upsert('meta', meta('og:url', 'property'), 'content', url),
        upsert(
          'link',
          { selector: 'link[rel="canonical"]', attrs: { rel: 'canonical' } },
          'href',
          url,
        ),
      )
    }
    if (structuredData) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
      restore.push(() => script.remove())
    }
    if (noindex) {
      restore.push(upsert('meta', meta('robots', 'name'), 'content', 'noindex'))
    }

    return () => {
      document.title = previousTitle
      restore.forEach((undo) => undo())
    }
  }, [title, description, path, noindex, canonical, ogTitle, ogDescription, ogImage, structuredData])
}
