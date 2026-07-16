import { slot4BrandConfig } from '@/editable/theme/brand.config'

const C = slot4BrandConfig.collections
const SITE = slot4BrandConfig.siteName

/*
  Voice: curated bookmarks / collections / resources.
  Never generic SaaS. Every string is written for a library-of-collections
  discovery site and references Curators / Resources / Collections directly.
*/
export const pagesContent = {
  home: {
    metadata: {
      title: `A curated library of ${C.plural.toLowerCase()}`,
      description: `Hand-picked ${C.itemPlural.toLowerCase()}, tools and references — organised into browsable ${C.plural.toLowerCase()} by real ${C.memberPlural.toLowerCase()}.`,
      openGraphTitle: `${SITE} — a library of ${C.plural.toLowerCase()}`,
      openGraphDescription: `${C.plural} of the best ${C.itemPlural.toLowerCase()} on the web, curated by real ${C.memberPlural.toLowerCase()}.`,
      keywords: ['bookmarks', 'collections', 'curated resources', 'reading library', 'link library', 'discovery'],
    },
    hero: {
      badge: `A ${SITE} library`,
      title: [
        `The best ${C.itemPlural.toLowerCase()} on the web,`,
        `organised into ${C.plural.toLowerCase()}.`,
      ],
      description: `${SITE} is a public library of ${C.plural.toLowerCase()} — bookmarks, tools and references chosen by real ${C.memberPlural.toLowerCase()}, not algorithms. Open a ${C.singular.toLowerCase()}, find something worth saving.`,
      primaryCta: { label: `Explore ${C.plural.toLowerCase()}`, href: '/sbm' },
      secondaryCta: { label: 'Search resources', href: '/search' },
      searchPlaceholder: `Search ${C.plural.toLowerCase()}, resources, ${C.memberPlural.toLowerCase()}…`,
      focusLabel: 'Focus',
      featureCardBadge: 'in the library right now',
      featureCardTitle: `Fresh ${C.itemPlural.toLowerCase()}, straight from the top of each ${C.singular.toLowerCase()}.`,
      featureCardDescription: `What ${C.memberPlural.toLowerCase()} added this week — no algorithm, no ranking games.`,
    },
    intro: {
      badge: 'About the library',
      title: `A quieter way to bookmark, save and share the good ${C.itemPlural.toLowerCase()}.`,
      paragraphs: [
        `${SITE} keeps the ${C.itemPlural.toLowerCase()} you actually want next to each other — grouped into ${C.plural.toLowerCase()} instead of drowned in a feed.`,
        `Every ${C.singular.toLowerCase()} has one ${C.memberSingular.toLowerCase()} behind it. They vouch for what goes in and remove what breaks.`,
        `Open a ${C.singular.toLowerCase()}, follow a ${C.memberSingular.toLowerCase()}, save what helps you.`,
      ],
      sideBadge: 'What you can do',
      sidePoints: [
        `Browse ${C.plural.toLowerCase()} by topic`,
        `Visit any ${C.itemSingular.toLowerCase()} directly with one click`,
        `Follow a ${C.memberSingular.toLowerCase()} whose taste maps to yours`,
        `Submit your own ${C.itemSingular.toLowerCase()} — real ${C.memberPlural.toLowerCase()} review it`,
      ],
      primaryLink: { label: `Browse ${C.plural.toLowerCase()}`, href: '/sbm' },
      secondaryLink: { label: 'Search', href: '/search' },
    },
    cta: {
      badge: 'Start browsing',
      title: `Find your next favourite ${C.itemSingular.toLowerCase()}.`,
      description: `Open a ${C.singular.toLowerCase()} and disappear for an afternoon. When you find something worth saving, add it back to the library.`,
      primaryCta: { label: `Open the library`, href: '/sbm' },
      secondaryCta: { label: 'Contact the team', href: '/contact' },
    },
    taskSection: {
      heading: `Latest ${C.itemPlural.toLowerCase()}`,
      descriptionSuffix: `Newest ${C.itemPlural.toLowerCase()} across every ${C.singular.toLowerCase()}.`,
    },
  },
  about: {
    badge: 'Our story',
    title: `A calmer way to find ${C.itemPlural.toLowerCase()}.`,
    description: `${SITE} is a public library. ${C.memberPlural} bring in the ${C.itemPlural.toLowerCase()}; readers come to browse without the noise of a feed.`,
    paragraphs: [
      `We started ${SITE} because bookmarking apps go stale and content feeds get louder every year. A ${C.singular.toLowerCase()} sits in between — small enough for one person to keep sharp, big enough to feel like a shelf worth returning to.`,
      `Every ${C.itemSingular.toLowerCase()} here was chosen by a real ${C.memberSingular.toLowerCase()} for a real reason. If something breaks or turns spammy, it leaves the shelf.`,
      `That's the whole product.`,
    ],
    values: [
      { title: `Curated, never ranked`, description: `Ordering by hand beats ordering by clicks. ${C.memberPlural} pick what goes at the top.` },
      { title: `Small, on purpose`, description: `A tight set of ${C.plural.toLowerCase()} you can actually finish reading, not an infinite scroll.` },
      { title: `Open by default`, description: `No paywall, no login to read. Sign in only when you want to publish your own ${C.singular.toLowerCase()}.` },
    ],
  },
  contact: {
    eyebrow: `Contact ${SITE}`,
    title: `Say something useful to the library.`,
    description: `Pitch a ${C.itemSingular.toLowerCase()}, start a new ${C.singular.toLowerCase()}, flag a broken link. Choose the lane that fits — we'll route it to the right ${C.memberSingular.toLowerCase()}.`,
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search the library',
      description: `Search across every ${C.singular.toLowerCase()} and ${C.itemSingular.toLowerCase()} in ${SITE}.`,
    },
    hero: {
      badge: 'Search the library',
      title: `Find a ${C.itemSingular.toLowerCase()}, a ${C.singular.toLowerCase()}, or a topic.`,
      description: `One search across every ${C.singular.toLowerCase()}. Filter by topic to narrow the shelf.`,
      placeholder: `Keyword, ${C.singular.toLowerCase()}, topic or title`,
    },
    resultsTitle: `Recently added to the library`,
  },
  create: {
    metadata: {
      title: `Add to the library`,
      description: `Add a ${C.itemSingular.toLowerCase()} to the library.`,
    },
    locked: {
      badge: `${C.memberSingular} access`,
      title: `Sign in to add a ${C.itemSingular.toLowerCase()}.`,
      description: `You need an account to contribute. It takes ten seconds — we ask for taste, not billing details.`,
    },
    hero: {
      badge: 'Publish',
      title: `Add a ${C.itemSingular.toLowerCase()} to the library.`,
      description: `Point us at a link. Add a line about why it belongs. Choose which ${C.singular.toLowerCase()} it fits.`,
    },
    formTitle: `${C.itemSingular} details`,
    submitLabel: `Add to library`,
    successTitle: `Your ${C.itemSingular.toLowerCase()} is in the queue.`,
  },
  auth: {
    login: {
      metadataDescription: `Login to ${SITE}.`,
      badge: `${C.memberSingular} sign-in`,
      title: `Welcome back, ${C.memberSingular.toLowerCase()}.`,
      description: `Sign in to publish new ${C.itemPlural.toLowerCase()} and manage your ${C.plural.toLowerCase()}.`,
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: `No account matched those details. Create one first, then sign in.`,
      success: 'Signed in. Redirecting…',
      createCta: `Create a ${C.memberSingular.toLowerCase()} account`,
    },
    signup: {
      metadataDescription: `Create an account on ${SITE}.`,
      badge: `Become a ${C.memberSingular.toLowerCase()}`,
      title: `Start your first ${C.singular.toLowerCase()}.`,
      description: `Create an account to publish ${C.itemPlural.toLowerCase()} and shape a ${C.singular.toLowerCase()} of your own.`,
      formTitle: `Create ${C.memberSingular.toLowerCase()} account`,
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: `More from this ${C.singular.toLowerCase()}`,
      fallbackTitle: `${C.itemSingular} notes`,
    },
    listing: {
      relatedTitle: `More from this ${C.singular.toLowerCase()}`,
      fallbackTitle: `${C.itemSingular} details`,
    },
    image: {
      relatedTitle: `More from this ${C.singular.toLowerCase()}`,
      fallbackTitle: `${C.itemSingular} details`,
    },
    profile: {
      relatedTitle: `Their ${C.plural.toLowerCase()}`,
      fallbackDescription: `${C.memberSingular} details will appear here once available.`,
      visitButton: `Visit ${C.itemSingular.toLowerCase()}`,
    },
  },
} as const
