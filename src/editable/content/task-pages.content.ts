import type { TaskKey } from '@/lib/site-config'
import { slot4BrandConfig } from '@/editable/theme/brand.config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

const C = slot4BrandConfig.collections

/*
  Voices for each task's archive. sbm is the flagship public surface —
  every other voice inherits the library-of-collections language so the
  site reads coherent no matter which lane data ends up in.
*/
export const taskPageVoices = {
  sbm: {
    eyebrow: C.plural,
    headline: `Every ${C.singular.toLowerCase()} in the library.`,
    description: `Themed shelves of hand-picked ${C.itemPlural.toLowerCase()} — tools, references, reads — grouped so you can browse without a feed getting in the way.`,
    filterLabel: `Filter ${C.plural.toLowerCase()}`,
    secondaryNote: `A ${C.singular.toLowerCase()} is small on purpose. Each one is kept sharp by its ${C.memberSingular.toLowerCase()}.`,
    chips: [`${C.plural}`, `${C.itemPlural}`, `${C.memberPlural}`, 'Hand-picked'],
  },
  profile: {
    eyebrow: C.memberSingular,
    headline: `${C.memberPlural} on the library.`,
    description: `The people who keep each ${C.singular.toLowerCase()} sharp.`,
    filterLabel: `Filter ${C.memberPlural.toLowerCase()}`,
    secondaryNote: `Every ${C.itemSingular.toLowerCase()} has a real ${C.memberSingular.toLowerCase()} behind it.`,
    chips: [`${C.memberPlural}`, 'Identity', 'Trust'],
  },
  article: {
    eyebrow: 'Reading',
    headline: `Long-form notes from across the library.`,
    description: `Writeups tied to ${C.plural.toLowerCase()} — worth reading top to bottom, not skimming.`,
    filterLabel: 'Filter reading',
    secondaryNote: 'Longer reads for when you want depth over a quick link.',
    chips: ['Long-form', 'Deep reads', `${C.plural}`],
  },
  classified: {
    eyebrow: 'Notices',
    headline: 'Time-sensitive posts.',
    description: 'Quick, dated posts kept separate from the evergreen shelves.',
    filterLabel: 'Filter notices',
    secondaryNote: 'Everything here has a shelf life.',
    chips: ['Quick', 'Dated'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Organised entries you can compare.',
    description: 'Practical detail — the kind of information you want in a row, not a paragraph.',
    filterLabel: 'Filter directory',
    secondaryNote: 'Rows over feeds, always.',
    chips: ['Directory', 'Practical'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'Visual pieces from the archive.',
    description: `${C.itemPlural} that are worth looking at, not just reading.`,
    filterLabel: 'Filter gallery',
    secondaryNote: 'Image-first shelves.',
    chips: ['Gallery', 'Visual'],
  },
  pdf: {
    eyebrow: 'Documents',
    headline: 'Downloadable references.',
    description: 'Guides, papers and long documents worth keeping.',
    filterLabel: 'Filter documents',
    secondaryNote: 'Persistent reference material.',
    chips: ['Documents', 'Reference'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
