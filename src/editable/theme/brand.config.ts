import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)

/*
  Slot 5 — premium editorial brand pack.
  Palette: navy canvas (#2C3947) with a gold accent (#C2A56D),
  slate secondary (#547A95) and light surface (#E8EDF2). Geist typography.
*/
export const slot4BrandConfig = {
  siteName: siteIdentity.name,
  tagline: siteIdentity.tagline,
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  productKind,
  ogImage: siteIdentity.ogImage,
  accents: {
    primary: '#C2A56D',
    surface: '#E8EDF2',
    dark: '#2C3947',
    secondary: '#547A95',
  },
  // Public label pair for the sbm task. Task keys/routes never change.
  collections: {
    plural: 'Collections',
    singular: 'Collection',
    memberPlural: 'Curators',
    memberSingular: 'Curator',
    itemPlural: 'Resources',
    itemSingular: 'Resource',
  },
} as const
