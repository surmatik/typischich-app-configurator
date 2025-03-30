import { redirect } from 'next/navigation'
import { getProductConfigBySlug } from '@/lib/getProductConfig'

export default function ProductPage({ params }: { params: { product: string } }) {
  const config = getProductConfigBySlug(params.product)

  if (!config || config.flow.length === 0) {
    redirect('/404')
  }

  // Direkt zum ersten Step weiterleiten
  const firstStep = config.flow[0]
  redirect(`/${params.product}/${firstStep}`)
}
