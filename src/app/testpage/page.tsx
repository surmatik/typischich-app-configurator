'use client'

import React from 'react'

export default function TestPage() {
  const buildAndRedirectToCart = (
    text: string,
    konfigID: string,
    geschlecht: string,
    groesse: string,
    farbe: string,
    druckfarbe: string
  ) => {
    const baseUrl = 'https://typischich.ch/cart/add'
    const variantId = '51964063285577' // Deine T-Shirt Variante

    const params = new URLSearchParams()
    params.append('id', variantId)
    params.append('quantity', '1')
    params.append('properties[Geschlecht]', geschlecht)
    params.append('properties[Grösse]', groesse)
    params.append('properties[Farbe]', farbe)
    params.append('properties[Druckfarbe]', druckfarbe)
    params.append('properties[Text]', text)
    params.append('properties[KonfigID]', konfigID)
    params.append('properties[_unique]', `${Date.now()}-${Math.floor(Math.random() * 100000)}`)

    const fullUrl = `${baseUrl}?${params.toString()}`

    // Weiterleitung
    window.location.href = fullUrl
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-xl font-bold">Test Page (per GET Link)</h1>

      <button
        onClick={() => buildAndRedirectToCart('Tom', 'konfig-001', 'Mann', 'L', 'weiss', 'Gold')}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Hinzufügen: Tom
      </button>

      <button
        onClick={() => buildAndRedirectToCart('Anna', 'konfig-002', 'Frau', 'M', 'schwarz', 'Silber')}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Hinzufügen: Anna
      </button>
    </div>
  )
}
