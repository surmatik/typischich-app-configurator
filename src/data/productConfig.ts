export interface ProductConfig {
    id: string
    title: string
    slug: string
    flow: string[]
    genderOptions?: string[]
    sizes?: string[]
  }
  
export const productConfigs: ProductConfig[] = [
    {
      id: '51964063285577',
      title: 'Mein persönliches T-Shirt',
      slug: 'mein-persoenliches-tshirt',
      flow: ['gender', 'size', 'color', 'druckfarbe', 'hobbys', 'landschaft', 'text', 'summary'],
      genderOptions: ['Frau', 'Mann', 'Kind'],
      sizes: [
        'Wähle eine Grösse aus',
        '122 / 128 (S)',
        '134 / 140 (M)',
        '146 / 152 (L)',
        '158 / 164 (XL)',
        'XS (nur für Frauengrösse)',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        '3XL (nur für Herrengrösse)',
      ],
      colors: ['schwarz', 'weiss'],
    },
    {
      id: '51964065972553',
      title: 'Mein persönlicher Hoodie',
      slug: 'mein-persoenlicher-hoodie',
      flow: ['gender', 'size', 'color', 'druckfarbe', 'hobbys', 'landschaft', 'text', 'summary'],
      genderOptions: ['Frau', 'Mann'],
      sizes: ['Wähle eine Grösse aus','XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL (nur Herrengrösse)'],
      colors: [
        'schwarz', 'weiss', 'gelb', 'orange', 'rot', 'bordeaux rot', 'soft rosa', 'pink', 'violett',
        'eisblau', 'blau', 'dunkelblau', 'grüngelb', 'eisgrün', 'hellgrün', 'waldgrün',
        'schokoladenbraun', 'dunkelgrau',
      ],
    },
    {
      id: '51964072919369',
      title: 'Mein persönlicher Hoodie für Kids',
      slug: 'mein-persoenlicher-hoodie-fuer-kids',
      flow: ['size', 'color', 'druckfarbe', 'hobbys', 'landschaft', 'text', 'summary'],
      sizes: ['Wähle eine Grösse aus','122/128', '134/146', '152/164'],
      colors: ['schwarz', 'pink', 'rot', 'hellblau', 'blau', 'dunkelblau', 'hellgrün'],
    },
    {
      id: 'shopify-id-4',
      title: 'Mein persönlicher Beanie',
      slug: 'mein-persoenlicher-beanie',
      flow: ['color', 'druckfarbe', 'text', 'summary'],
    },
    {
      id: 'shopify-id-5',
      title: 'Mein persönlicher Schlüsselanhänger',
      slug: 'mein-persoenlicher-schluesselanhaenger',
      flow: ['druckfarbe', 'text', 'summary'],
    },
    {
      id: 'shopify-id-6',
      title: 'Mein kleiner Filz-Bag',
      slug: 'mein-kleiner-filz-bag',
      flow: ['color', 'text', 'summary'],
    },
  ]
  