import { redirect } from 'next/navigation'
import { getProductConfigBySlug } from '@/lib/getProductConfig'

export default async function ProductPage({ params }: { params: { product: string } }) {
  const config = getProductConfigBySlug(params.product)

  if (!config || config.flow.length === 0) {
    redirect('/404') // oder eine Fehlerseite deiner Wahl
  }

  const firstStep = config.flow[0]
  redirect(`/${params.product}/${firstStep}`)
}
