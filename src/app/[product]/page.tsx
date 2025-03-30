'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getProductConfigBySlug } from '@/lib/getProductConfig'

export default function Page() {
  const router = useRouter()
  const { product } = useParams()

  useEffect(() => {
    if (!product) return
    const config = getProductConfigBySlug(product as string)
    if (config && config.flow.length > 0) {
      router.replace(`/${product}/${config.flow[0]}`)
    }
  }, [product])

  return (
    <div className="bg-white min-h-screen" />
  )
}
