// src/app/[product]/page.tsx

import { redirect } from 'next/navigation'
import { getProductConfigBySlug } from '@/lib/getProductConfig'

export default async function Page({ params }: { params: { product: string } }) {
  const config = getProductConfigBySlug(params.product)

  if (!config) {
    return <p className="p-8">❌ Produkt nicht gefunden.</p>
  }

  const firstStep = config.flow[0] ?? 'summary'
  redirect(`/${params.product}/${firstStep}`)
}
