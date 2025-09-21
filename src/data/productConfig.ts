export interface ProductConfig {
  id: string
  title: string
  slug: string
  flow: string[]
  genderOptions?: string[]
  sizes?: string[]
  colors?: string[]
  maxHobbys?: number
}
export const productConfigs: ProductConfig[] = [
    {
      id: '51964063285577',
      title: 'Mein persönliches T-Shirt',
      slug: 'mein-persoenliches-tshirt',
      flow: ['gender', 'size', 'color', 'druckfarbe', 'hobbys', 'landschaft', 'text', 'summary'],
      genderOptions: ['Frau', 'Mann'],
      sizes: [
        'Wähle eine Grösse aus',
        'XS (nur für Frauengrösse)',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        '3XL (nur für Herrengrösse)',
      ],
      colors: ['schwarz', 'weiss'],
      maxHobbys: 3
    },
    {
      id: '52572910190921',
      title: 'Mein persönliches Kinder T-Shirt',
      slug: 'mein-persoenliches-kinder-tshirt',
      flow: ['size', 'color', 'druckfarbe', 'hobbys', 'landschaft', 'text', 'summary'],
      genderOptions: ['Frau', 'Mann', 'Kind'],
      sizes: [
        'Wähle eine Grösse aus',
        '122 / 128 (S)',
        '134 / 140 (M)',
        '146 / 152 (L)',
        '158 / 164 (XL)',
      ],
      colors: ['schwarz', 'weiss'],
      maxHobbys: 3
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
      maxHobbys: 3
    },
    {
      id: '51964072919369',
      title: 'Mein persönlicher Hoodie für Kids',
      slug: 'mein-persoenlicher-hoodie-fuer-kids',
      flow: ['size', 'color', 'druckfarbe', 'hobbys', 'landschaft', 'text', 'summary'],
      sizes: ['Wähle eine Grösse aus','122/128', '134/146', '152/164'],
      colors: ['schwarz', 'pink', 'rot', 'hellblau', 'blau', 'dunkelblau', 'hellgrün'],
      maxHobbys: 3
    },
    {
      id: '52979688014153',
      title: 'Mein persönlicher Pullover',
      slug: 'mein-mein-persoenlicher-pullover',
      flow: ['gender', 'size', 'color', 'druckfarbe', 'hobbys', 'landschaft', 'text', 'summary'],
      genderOptions: ['Frau', 'Mann'],
      sizes: ['Wähle eine Grösse aus','XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL (nur Herrengrösse)'],
      colors: [
        'schwarz', 'weiss', 'gelb', 'orange', 'rot', 'bordeaux rot', 'soft rosa', 'pink', 'violett',
        'eisblau', 'blau', 'dunkelblau', 'grüngelb', 'eisgrün', 'hellgrün', 'waldgrün',
        'schokoladenbraun', 'dunkelgrau',
      ],
      maxHobbys: 3
    },
    {
      id: '52005733269833',
      title: 'Mein persönlicher Beanie',
      slug: 'mein-persoenlicher-beanie',
      flow: ['color', 'hobbys', 'text', 'summary'],
      colors: ['olivegrün', 'dunkelblau', 'grau', 'schwarz'],
      maxHobbys: 1
    },
    {
      id: '52005739495753',
      title: 'Mein persönlicher Schlüsselanhänger',
      slug: 'mein-persoenlicher-schluesselanhaenger',
      flow: ['hobbys', 'druckfarbe', 'text', 'summary'],
      colors: ['grau'],
      maxHobbys: 1
    },
    {
      id: '52005744312649',
      title: 'Mein kleiner Filz-Bag',
      slug: 'mein-kleiner-filz-bag',
      flow: ['color', 'hobbys', 'druckfarbe', 'text', 'summary'],
      colors: ['dunkelgrau', 'hellgrau'],
      maxHobbys: 1
    },
    {
      id: '52005751193929',
      title: 'Hoodie für den Gipfelstürmer',
      slug: 'hoodie-fuer-den-gipfelsturmer',
      flow: ['gender','size', 'color', 'druckfarbe', 'summary'],
      genderOptions: ['Frau', 'Mann'],
      sizes: ['Wähle eine Grösse aus','XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL (nur Herrengrösse)'],
      colors: [
        'schwarz', 'weiss', 'gelb', 'orange', 'rot', 'bordeaux rot', 'soft rosa', 'pink', 'violett',
        'eisblau', 'blau', 'dunkelblau', 'grüngelb', 'eisgrün', 'hellgrün', 'waldgrün',
        'schokoladenbraun', 'dunkelgrau',
      ],
    },
    {
      id: '52005755814217',
      title: 'Hoodie für den Waldfreund',
      slug: 'hoodie-fuer-den-waldfreund',
      flow: ['gender','size', 'color', 'druckfarbe', 'summary'],
      genderOptions: ['Frau', 'Mann'],
      sizes: ['Wähle eine Grösse aus','XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL (nur Herrengrösse)'],
      colors: [
        'schwarz', 'weiss', 'gelb', 'orange', 'rot', 'bordeaux rot', 'soft rosa', 'pink', 'violett',
        'eisblau', 'blau', 'dunkelblau', 'grüngelb', 'eisgrün', 'hellgrün', 'waldgrün',
        'schokoladenbraun', 'dunkelgrau',
      ],
    },
    {
      id: '52005773181257',
      title: 'T-Shirt für den Gipfelstürmer',
      slug: 't-shirt-fuer-den-gipfelsturmer',
      flow: ['gender', 'size', 'color', 'druckfarbe', 'summary'],
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
      id: '52005764366665',
      title: 'T-Shirt für den Waldfreund',
      slug: 't-shirt-fuer-den-waldfreund',
      flow: ['gender', 'size', 'color', 'druckfarbe', 'summary'],
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
      id: '52572840689993',
      title: 'Meine persönliche Trinkflasche',
      slug: 'meine-persoenliche-trinkflasche',
      flow: ['hobbys', 'landschaft', 'text', 'summary'],
      colors: ['schwarz'],
      maxHobbys: 3
    },
  ]
  