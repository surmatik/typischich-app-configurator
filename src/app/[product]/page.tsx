'use client'

import { useParams, useRouter } from 'next/navigation'
import { getProductConfigBySlug } from '@/lib/getProductConfig'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const { product } = useParams()
  const config = getProductConfigBySlug(product as string)

  useEffect(() => {
    if (!config || config.flow.length === 0) return
    router.push(`/${product}/${config.flow[0]}`)
  }, [product])

  return <p className="p-8">🔄 Weiterleitung...</p>
}
