import { redirect } from 'next/navigation'
import { getProductConfigBySlug } from '@/lib/getProductConfig'

interface Props {
  params: { product: string }
}

export default function ConfiguratorEntryPage({ params }: Props) {
  const config = getProductConfigBySlug(params.product)

  if (!config || config.flow.length === 0) {
    return <p className="p-8">❌ Produkt nicht gefunden oder kein Ablauf definiert.</p>
  }

  const firstStep = config.flow[0]
  redirect(`/${params.product}/${firstStep}`)
}
