import { redirect } from 'next/navigation'
import { getProductConfigBySlug } from '@/lib/getProductConfig'

type Props = {
  params: {
    product: string
  }
}

export default async function ProductPage({ params }: Props) {
  const config = getProductConfigBySlug(params.product)

  if (!config || config.flow.length === 0) {
    redirect('/404') // oder ein Fallback
  }

  const firstStep = config.flow[0]
  redirect(`/${params.product}/${firstStep}`)
}
