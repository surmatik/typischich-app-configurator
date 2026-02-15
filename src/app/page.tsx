import Link from 'next/link'
import Image from 'next/image'
import { productConfigs } from '@/data/productConfig'

function getProductIcon(slug: string) {
  if (slug.includes('tshirt') || slug.includes('t-shirt')) return '👕'
  if (slug.includes('hoodie')) return '🧥'
  if (slug.includes('pullover')) return '🧶'
  if (slug.includes('beanie')) return '🧢'
  if (slug.includes('schluesselanhaenger')) return '🔑'
  if (slug.includes('filz-bag')) return '👜'
  if (slug.includes('trinkflasche')) return '🧴'
  if (slug.includes('rucksack')) return '🎒'
  return '🎁'
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f6f8] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-2xl border border-[#e2e8ef] bg-white p-6 shadow-sm text-center">
          <Image
            src="https://typischich.ch/cdn/shop/files/logo_black.png?v=1740907843&width=140"
            alt="Typisch Ich Logo"
            width={140}
            height={140}
            className="mx-auto h-16 w-auto"
          />
          <h1 className="mt-3 text-3xl font-bold text-[#1c2228]">Typisch Ich Konfigurator</h1>
          <p className="mt-2 text-sm text-gray-600">Wähle ein Produkt und starte direkt mit der Konfiguration.</p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productConfigs.map((product) => {
            const firstStep = product.flow[0]
            const href = firstStep ? `/${product.slug}/${firstStep}` : `/${product.slug}`

            return (
              <article
                key={product.id}
                className="rounded-2xl border border-[#e2e8ef] bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3f8] text-xl">
                  {getProductIcon(product.slug)}
                </div>
                <h2 className="text-lg font-semibold text-[#1c2228]">{product.title}</h2>

                <div className="mt-5">
                  <Link
                    href={href}
                    className="inline-flex items-center justify-center rounded-lg bg-[#1c2228] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Jetzt konfigurieren
                  </Link>
                </div>
              </article>
            )
          })}
        </section>
      </div>
    </main>
  )
}
