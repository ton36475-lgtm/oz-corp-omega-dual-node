import type { MetadataRoute } from 'next'
import { provinces } from '@/data/provinces'

export const dynamic = 'force-static'

const BASE_URL = 'https://sirinx.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static main routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/solar`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/dashboard`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/leads`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ]

  // Province hub pages (P1 = 0.9, P2 = 0.8, P3 = 0.7)
  const provinceRoutes: MetadataRoute.Sitemap = provinces.map((p) => ({
    url: `${BASE_URL}/solar/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: p.priority === 'P1' ? 0.9 : p.priority === 'P2' ? 0.8 : 0.7,
  }))

  return [...staticRoutes, ...provinceRoutes]
}
