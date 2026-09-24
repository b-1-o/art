export type ArtworkCategory = 'Painting' | 'Works on Paper' | 'Object'

export type Artwork = {
  id: string
  number: string
  title: string
  subtitle: string
  category: ArtworkCategory
  year: number
  medium: string
  dimensions: string
  price: number
  status: 'Available' | 'Sold' | 'Edition'
  featured?: boolean
  image: string
  credit: string
  creditUrl: string
  description: string
  accent: string
}

export const artworks: Artwork[] = [
  {
    id: 'afterglow',
    number: '01',
    title: 'Afterglow',
    subtitle: 'a quiet edge of summer',
    category: 'Painting',
    year: 2026,
    medium: 'Oil and pigment on linen',
    dimensions: '36 × 48 in',
    price: 1800,
    status: 'Available',
    featured: true,
    image: 'https://images.unsplash.com/photo-1536851101967-55988a52f455?auto=format&fit=crop&w=1800&q=88',
    credit: 'Ivan Bandura / Unsplash',
    creditUrl: 'https://unsplash.com/photos/abstract-painting-artwork-zBY6td_nVNA',
    description: 'A study of suspended color and the few seconds after light leaves a room. Built in thin, transparent layers so that darker passages remain luminous.',
    accent: '#8d6b42',
  },
  {
    id: 'blue-hour',
    number: '02',
    title: 'Blue Hour',
    subtitle: 'memory, translated',
    category: 'Painting',
    year: 2026,
    medium: 'Acrylic, graphite and wax on panel',
    dimensions: '24 × 32 in',
    price: 1250,
    status: 'Available',
    featured: true,
    image: 'https://images.unsplash.com/photo-1532799755889-1247a1b7f10e?auto=format&fit=crop&w=1600&q=88',
    credit: 'Steve A Johnson / Unsplash',
    creditUrl: 'https://unsplash.com/photos/abstract-painting-Cdr1ryVJyQA',
    description: 'Built around cool blues, chalky whites and a single violet interruption. The work sits between landscape and abstraction without committing fully to either.',
    accent: '#53657f',
  },
  {
    id: 'white-room',
    number: '03',
    title: 'White Room',
    subtitle: 'the architecture of attention',
    category: 'Works on Paper',
    year: 2025,
    medium: 'Ink and charcoal on cotton',
    dimensions: '18 × 24 in',
    price: 680,
    status: 'Edition',
    featured: true,
    image: 'https://images.unsplash.com/photo-1498721409281-998093cc905b?auto=format&fit=crop&w=1600&q=88',
    credit: 'CHUTTERSNAP / Unsplash',
    creditUrl: 'https://unsplash.com/photos/abstract-painting-uj1tRjP5UI0',
    description: 'A work about framing: what is present, what is cropped, and what the eye invents to complete the scene. Edition of 25.',
    accent: '#9a8f79',
  },
  {
    id: 'the-witness',
    number: '04',
    title: 'The Witness',
    subtitle: 'one body, many images',
    category: 'Object',
    year: 2025,
    medium: 'Steel, found wood and linen',
    dimensions: '22 × 18 × 14 in',
    price: 920,
    status: 'Sold',
    image: 'https://images.unsplash.com/photo-1770129703548-e1ced0e4f118?auto=format&fit=crop&w=1600&q=88',
    credit: 'Fons Heijnsbroek / Unsplash',
    creditUrl: 'https://unsplash.com/photos/abstract-painting-with-bold-brushstrokes-and-vibrant-colors-S1Cv0sXA7uI',
    description: 'A small sculptural study of looking. The object is intentionally architectural, more like a threshold than a figure.',
    accent: '#7a574b',
  },
  {
    id: 'green-memory',
    number: '05',
    title: 'Green Memory',
    subtitle: 'notes from a slower place',
    category: 'Painting',
    year: 2025,
    medium: 'Oil, wax and earth pigment',
    dimensions: '40 × 40 in',
    price: 1600,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1536851101967-55988a52f455?auto=format&fit=crop&w=1600&q=88',
    credit: 'Helena Lopes / Unsplash',
    creditUrl: 'https://unsplash.com/photos/abstract-painting-artwork-zBY6td_nVNA',
    description: 'Green is treated here less as a color than as a temperature. The surface shifts between forest, mineral and oxidized metal.',
    accent: '#52634d',
  },
  {
    id: 'studio-light',
    number: '06',
    title: 'Studio Light',
    subtitle: 'process / fragment',
    category: 'Works on Paper',
    year: 2026,
    medium: 'Graphite, oil stick and pastel',
    dimensions: '12 × 16 in',
    price: 340,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1498721409281-998093cc905b?auto=format&fit=crop&w=1400&q=82',
    credit: 'Engin Akyurt / Unsplash',
    creditUrl: 'https://unsplash.com/photos/abstract-painting-uj1tRjP5UI0',
    description: 'A smaller work made between larger canvases. The gestures are deliberately exposed rather than refined away.',
    accent: '#695b48',
  },
]

export const collections = [
  {
    title: 'Field Notes',
    count: '08 works',
    description: 'Color studies, fragments and works made in direct response to landscape.',
  },
  {
    title: 'Interior Weather',
    count: '06 works',
    description: 'A slower series about rooms, memory, atmosphere and the architecture of attention.',
  },
  {
    title: 'Small Objects',
    count: '04 works',
    description: 'Sculptural studies that sit between furniture, image and threshold.',
  },
]

export const courses = [
  {
    id: 'visual-language',
    title: 'Finding Your Visual Language',
    eyebrow: '04 sessions',
    duration: '2 weeks',
    price: 95,
    description: 'A small-group workshop about taste, references, repetition and developing a visual vocabulary you can actually use.',
  },
  {
    id: 'color-atmosphere',
    title: 'Color & Atmosphere',
    eyebrow: '06 sessions',
    duration: '3 weeks',
    price: 140,
    description: 'Learn how temperature, value and edge control can create a sense of place without over-explaining the image.',
  },
  {
    id: 'process-studio',
    title: 'Process Studio',
    eyebrow: '01:1 mentorship',
    duration: '75 minutes',
    price: 80,
    description: 'A focused portfolio and process review for emerging artists who need a clearer next step.',
  },
]

export const studioFacts = [
  ['12', 'years working across painting, image and object'],
  ['34', 'works currently archived in the studio catalogue'],
  ['18', 'private commissions completed since 2021'],
]

export const navItems = [
  ['/', 'Index'],
  ['/works', 'Works'],
  ['/shop', 'Shop'],
  ['/learn', 'Learn'],
  ['/studio', 'Studio'],
  ['/contact', 'Contact'],
] as const
