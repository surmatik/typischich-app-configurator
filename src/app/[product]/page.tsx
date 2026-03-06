'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getProductConfigBySlug } from '@/lib/getProductConfig'

export default function Page() {
  const router = useRouter()
  const { product } = useParams()
  const productSlug = typeof product === 'string' ? product : ''
  const config = productSlug ? getProductConfigBySlug(productSlug) : undefined
  const firstStep = config?.flow?.[0]

  useEffect(() => {
    if (productSlug && firstStep) {
      router.replace(`/${productSlug}/${firstStep}`)
    }
  }, [productSlug, firstStep, router])

  if (firstStep) {
    return <div className="bg-white min-h-screen" />
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff7e6_0%,#f9f9f9_55%)] flex items-center justify-center px-4">
      <div className="pointer-events-none absolute top-12 left-10 h-16 w-16 rounded-full bg-[#ffd27f]/40 blur-sm" />
      <div className="pointer-events-none absolute bottom-16 right-10 h-20 w-20 rounded-full bg-[#b8e3ff]/35 blur-sm" />
      <div className="w-full max-w-xl bg-white border border-[#f2ddb7] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-8 text-center relative">
        <div className="absolute -top-4 -right-4 rotate-6 rounded-full border border-[#f0ca8a] bg-[#ffe8bf] px-3 py-1 text-xs font-semibold text-[#8a6a2f]">
          Hoppla
        </div>
        <p className="inline-block text-xs tracking-[0.18em] font-semibold text-[#8a6a2f] bg-[#fff3dc] border border-[#f5deb3] rounded-full px-3 py-1 mb-4">
          404
        </p>

        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl border border-[#f5deb3] bg-gradient-to-b from-[#fff8ea] to-[#ffeecf]">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M19 11L10 16L14 24H18V44H38V24H42L46 16L37 11L32 16H24L19 11Z"
              fill="#1c2228"
            />
            <path
              d="M24.7 26.8C24.8 23.7 27 22 29.8 22C32.4 22 34.5 23.4 34.5 26.1C34.5 28 33.4 29.1 31.9 30L30.8 30.7C29.7 31.3 29.1 32 29.1 33.2V34"
              stroke="#FFD27F"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="29" cy="37.8" r="1.4" fill="#FFD27F" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-[#1c2228] mb-3">Ups, dieses Produkt hat sich versteckt</h1>
        <p className="text-gray-600 mb-1">
          Unter dieser Adresse konnten wir kein Produkt finden.
        </p>
        <p className="text-gray-600 mb-7">
          Spring zurück zur Hauptseite und starte dort einen neuen Konfigurator.
        </p>
        <a
          href="https://typischich.ch/"
          className="inline-block bg-[#1c2228] text-white py-3 px-7 rounded-xl hover:opacity-90 transition shadow-lg shadow-[#1c2228]/20"
        >
          Zurück zu typischich.ch
        </a>
      </div>
    </div>
  )
}
