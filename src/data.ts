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

const commons = 'https://commons.wikimedia.org/wiki/Special:FilePath/'

export const artworks: Artwork[] = [
  {
    id: 'the-kiss',
    number: '01',
    title: 'The Kiss',
    subtitle: 'Gustav Klimt',
    category: 'Painting',
    year: 1908,
    medium: 'Oil, gold and silver leaf on canvas',
    dimensions: '180 × 180 cm',
    price: 0,
    status: 'Sold',
    featured: true,
    image: commons + 'Klimt_-_The_Kiss.jpg',
    credit: 'Gustav Klimt / Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Klimt_-_The_Kiss.jpg',
    description: 'A monumental Symbolist painting from Klimt’s Golden Period, built from luminous fields of gold, ornamental pattern and intimate figures.',
    accent: '#c8a96d',
  },
  {
    id: 'starry-night',
    number: '02',
    title: 'The Starry Night',
    subtitle: 'Vincent van Gogh',
    category: 'Painting',
    year: 1889,
    medium: 'Oil on canvas',
    dimensions: '73.7 × 92.1 cm',
    price: 0,
    status: 'Sold',
    featured: true,
    image: commons + 'Vincent_van_Gogh_Starry_Night.jpg',
    credit: 'Vincent van Gogh / Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_Starry_Night.jpg',
    description: 'Van Gogh’s 1889 night landscape, with a turbulent sky, luminous stars and a dark cypress organizing the composition.',
    accent: '#667ca6',
  },
  {
    id: 'water-lilies',
    number: '03',
    title: 'Water Lilies',
    subtitle: 'Claude Monet',
    category: 'Painting',
    year: 1924,
    medium: 'Oil on canvas',
    dimensions: '219 × 602 cm',
    price: 0,
    status: 'Sold',
    featured: true,
    image: commons + 'Water_lilies_Monet.jpg',
    credit: 'Claude Monet / Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Water_lilies_Monet.jpg',
    description: 'An expansive late Monet water-lily composition, where the horizon dissolves and surface, reflection and atmosphere become one field.',
    accent: '#7c8f88',
  },
  {
    id: 'girl-with-a-pearl-earring',
    number: '04',
    title: 'Girl with a Pearl Earring',
    subtitle: 'Johannes Vermeer',
    category: 'Painting',
    year: 1665,
    medium: 'Oil on canvas',
    dimensions: '44.5 × 39 cm',
    price: 0,
    status: 'Sold',
    featured: true,
    image: commons + '1665_Girl_with_a_Pearl_Earring.jpg',
    credit: 'Johannes Vermeer / Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:1665_Girl_with_a_Pearl_Earring.jpg',
    description: 'A restrained Vermeer portrait built around light, color and the reflective accent of a single pearl.',
    accent: '#b39a75',
  },
  {
    id: 'fighting-temeraire',
    number: '05',
    title: 'The Fighting Temeraire',
    subtitle: 'J. M. W. Turner',
    category: 'Painting',
    year: 1839,
    medium: 'Oil on canvas',
    dimensions: '90.7 × 121.6 cm',
    price: 0,
    status: 'Sold',
    featured: true,
    image: commons + 'The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg',
    credit: 'J. M. W. Turner / Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:The_Fighting_Temeraire,_JMW_Turner,_National_Gallery.jpg',
    description: 'Turner’s celebrated sunset scene of a warship being towed toward its final berth, balanced between memory, machinery and dissolving light.',
    accent: '#a88a62',
  },
  {
    id: 'night-watch',
    number: '06',
    title: 'The Night Watch',
    subtitle: 'Rembrandt van Rijn',
    category: 'Painting',
    year: 1642,
    medium: 'Oil on canvas',
    dimensions: '363 × 437 cm',
    price: 0,
    status: 'Sold',
    featured: true,
    image: commons + 'The_Night_Watch.jpg',
    credit: 'Rembrandt / Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:The_Night_Watch.jpg',
    description: 'A monumental civic guard portrait transformed into a dramatic scene through movement, light and Rembrandt’s deep tonal architecture.',
    accent: '#a48a5b',
  },
  {
    id: 'birth-of-venus',
    number: '07',
    title: 'The Birth of Venus',
    subtitle: 'Sandro Botticelli',
    category: 'Painting',
    year: 1485,
    medium: 'Tempera on canvas',
    dimensions: '172.5 × 278.5 cm',
    price: 0,
    status: 'Sold',
    featured: true,
    image: commons + 'The_Birth_of_Venus_by_Botticelli.jpg',
    credit: 'Sandro Botticelli / Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:The_Birth_of_Venus_by_Botticelli.jpg',
    description: 'A Renaissance mythological composition known for its linear elegance, pale palette and highly controlled silhouette.',
    accent: '#b99b83',
  },
  {
    id: 'arnolfini-portrait',
    number: '08',
    title: 'The Arnolfini Portrait',
    subtitle: 'Jan van Eyck',
    category: 'Painting',
    year: 1434,
    medium: 'Oil on oak panel',
    dimensions: '82.2 × 60 cm',
    price: 0,
    status: 'Sold',
    featured: true,
    image: commons + 'The_Arnolfini_portrait_%281434%29.jpg',
    credit: 'Jan van Eyck / Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:The_Arnolfini_portrait_(1434).jpg',
    description: 'A densely detailed 1434 portrait whose polished surfaces, symbols and mirror create a complete domestic world inside a single room.',
    accent: '#76604a',
  },
  {
    id: 'wheatfield-under-thunderclouds',
    number: '09',
    title: 'Wheatfield under Thunderclouds',
    subtitle: 'Vincent van Gogh',
    category: 'Painting',
    year: 1890,
    medium: 'Oil on canvas',
    dimensions: '50.4 × 101.3 cm',
    price: 0,
    status: 'Sold',
    featured: true,
    image: commons + 'WLANL_-_MicheleLovesArt_-_Van_Gogh_Museum_-_Wheatfield_under_thunderclouds%2C_1890.jpg',
    credit: 'Vincent van Gogh / Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:WLANL_-_MicheleLovesArt_-_Van_Gogh_Museum_-_Wheatfield_under_thunderclouds,_1890.jpg',
    description: 'A late Van Gogh landscape in which a narrow field meets a deep, rolling sky, emphasizing movement, weather and scale.',
    accent: '#677b61',
  },
  {
    id: 'river-landscape-with-ferry',
    number: '10',
    title: 'River Landscape with Ferry',
    subtitle: 'Salomon van Ruysdael',
    category: 'Painting',
    year: 1649,
    medium: 'Oil on panel',
    dimensions: 'Museum record',
    price: 0,
    status: 'Sold',
    featured: true,
    image: commons + 'Amsterdam_-_Rijksmuseum_1885_-_The_Gallery_of_Honour_%281st_Floor%29_-_River_landscape_with_Ferry_1649_by_Salomon_van_Ruysdael.jpg',
    credit: 'Salomon van Ruysdael / Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Amsterdam_-_Rijksmuseum_1885_-_The_Gallery_of_Honour_(1st_Floor)_-_River_landscape_with_Ferry_1649_by_Salomon_van_Ruysdael.jpg',
    description: 'A seventeenth-century Dutch river landscape balancing moving water, distant architecture, ferries and a broad atmospheric sky.',
    accent: '#6e806f',
  },
]

export const collections = [
  {
    title: 'Golden Atmospheres',
    count: '04 works',
    description: 'Paintings where warm metal, lamplight and restrained color create a sense of ceremonial richness.',
  },
  {
    title: 'Nocturnes & Blue',
    count: '03 works',
    description: 'Deep blues, night scenes and paintings built around the drama of low light.',
  },
  {
    title: 'Museum Classics',
    count: '10 works',
    description: 'A private digital salon of public-domain paintings selected for their material presence and visual authority.',
  },
]

export const courses = [
  {
    id: 'visual-language',
    title: 'Reading a Masterpiece',
    eyebrow: '04 sessions',
    duration: '2 weeks',
    price: 95,
    description: 'A guided study of composition, value, material, rhythm and visual hierarchy through canonical paintings.',
  },
  {
    id: 'color-atmosphere',
    title: 'Color & Atmosphere',
    eyebrow: '06 sessions',
    duration: '3 weeks',
    price: 140,
    description: 'Explore temperature, contrast and edge control using works from the collection as visual references.',
  },
  {
    id: 'process-studio',
    title: 'Private Portfolio Review',
    eyebrow: '01:1',
    duration: '75 minutes',
    price: 80,
    description: 'A focused review of presentation, image selection and visual identity for an emerging creative portfolio.',
  },
]

export const studioFacts = [
  ['10', 'paintings currently in the digital salon'],
  ['09', 'artists represented across four centuries'],
  ['∞', 'ways to return to the same image'],
]

export const navItems = [
  ['/', 'Index'],
  ['/works', 'Collection'],
  ['/learn', 'Journal'],
  ['/studio', 'Studio'],
  ['/contact', 'Contact'],
] as const
