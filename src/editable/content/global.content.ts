import { slot4BrandConfig } from '@/editable/theme/brand.config'

/*
  Tasks whose UI is hidden from every public surface (navbar, footer, home
  discovery, search filter results, create picker, stats). Detail pages
  still resolve for direct URLs so the underlying data stays functional.
*/
export const uiHiddenTaskKeys = ['profile'] as const
export type UiHiddenTaskKey = (typeof uiHiddenTaskKeys)[number]
export const isUiHiddenTask = (key: string) => (uiHiddenTaskKeys as readonly string[]).includes(key)

const C = slot4BrandConfig.collections

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A curated library of collections and resources',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'A curated library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Explore collections', href: '/sbm' },
      secondary: { label: 'Submit a resource', href: '/contact' },
    },
  },
  footer: {
    tagline: `A curated library of ${C.plural.toLowerCase()} and ${C.itemPlural.toLowerCase()}`,
    description: `${slot4BrandConfig.siteName} is a public library of ${C.plural.toLowerCase()} — bookmarks, references and ${C.itemPlural.toLowerCase()} organised by real ${C.memberPlural.toLowerCase()}.`,
    collectionsHeading: C.plural,
    collectionCategories: [
      { label: 'Design', slug: 'design' },
      { label: 'Engineering', slug: 'engineering' },
      { label: 'Product', slug: 'product' },
      { label: 'Marketing', slug: 'marketing' },
      { label: 'Reading', slug: 'reading' },
      { label: 'Tools', slug: 'tools' },
    ],
    columns: [
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: `Built for people who bookmark, save and share the good ${C.itemPlural.toLowerCase()}.`,
  },
  commonLabels: {
    readMore: 'Open resource',
    viewAll: `View all ${C.plural.toLowerCase()}`,
    explore: 'Explore',
    latest: 'Recently curated',
    related: `More in this ${C.singular.toLowerCase()}`,
    published: 'Curated',
    visitResource: `Visit ${C.itemSingular.toLowerCase()}`,
  },
  collections: C,
} as const
