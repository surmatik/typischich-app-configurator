// app/[product]/page.tsx

import { redirect } from 'next/navigation'
import { getProductConfigBySlug } from '@/lib/getProductConfig'

interface PageProps {
  params: { product: string }
}

export default function ProductPage({ params }: PageProps) {
  const config = getProductConfigBySlug(params.product)

  if (!config || config.flow.length === 0) {
    // Optional: Du kannst hier auch eine 404-Seite rendern
    return redirect('/404')
  }

  const firstStep = config.flow[0]
  return redirect(`/${params.product}/${firstStep}`)
}
