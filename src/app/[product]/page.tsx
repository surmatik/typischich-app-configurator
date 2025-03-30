import { redirect } from 'next/navigation'
import { getProductConfigBySlug } from '@/lib/getProductConfig'

export default function ProductPage({ params }: { params: { product: string } }) {
  const config = getProductConfigBySlug(params.product)

  if (!config || config.flow.length === 0) {
    return (
      <div className="p-8 text-center text-[#262626]">
        ❌ Produkt nicht gefunden.
      </div>
    )
  }

  redirect(`/${params.product}/${config.flow[0]}`)
}
