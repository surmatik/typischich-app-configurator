import { redirect } from 'next/navigation'
import { getProductConfigBySlug } from '@/lib/getProductConfig'

interface PageProps {
  params: { product: string }
}

export default async function ProductPage({ params }: PageProps) {
  const config = getProductConfigBySlug(params.product)

  if (!config) {
    return <p>❌ Produkt nicht gefunden.</p>
  }

  const firstStep = config.flow[0]
  redirect(`/configurator/${params.product}/${firstStep}`)
}
