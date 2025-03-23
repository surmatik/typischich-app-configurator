'use client'

import { useParams, useRouter } from 'next/navigation'
import { getNextStep, getProductConfigBySlug } from '@/lib/getProductConfig'
import { useConfiguratorStore } from '@/state/configuratorStore'
import StepWrapper from '@/components/StepWrapper'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

export default function ConfiguratorStepPage() {
  const { product, step } = useParams() as { product: string; step: string }
  const router = useRouter()
  const config = getProductConfigBySlug(product)

  const currentIndex = config.flow.indexOf(step)
  const [prevIndex, setPrevIndex] = useState(currentIndex)
  const [direction, setDirection] = useState(0)

  const setGender = useConfiguratorStore((s) => s.setGender)
  const setSize = useConfiguratorStore((s) => s.setSize)
  const setColor = useConfiguratorStore((s) => s.setColor)
  const setDruckfarbe = useConfiguratorStore((s) => s.setDruckfarbe)
  const setHobbys = useConfiguratorStore((s) => s.setHobbys)
  const setLandschaft = useConfiguratorStore((s) => s.setLandschaft)
  const setNameType = useConfiguratorStore((s) => s.setNameType)
  const setCustomName = useConfiguratorStore((s) => s.setCustomName)

  const gender = useConfiguratorStore((s) => s.gender)
  const storeSize = useConfiguratorStore((s) => s.size)
  const storeColor = useConfiguratorStore((s) => s.color)
  const storeDruckfarbe = useConfiguratorStore((s) => s.druckfarbe)
  const storeHobbys = useConfiguratorStore((s) => s.hobbys)
  const storeLandschaft = useConfiguratorStore((s) => s.landschaft)
  const storeNameType = useConfiguratorStore((s) => s.nameType)
  const storeCustomName = useConfiguratorStore((s) => s.customName)

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedDruckfarbe, setSelectedDruckfarbe] = useState('')
  const [selectedHobbys, setSelectedHobbys] = useState<string[]>([])
  const [selectedLandschaft, setSelectedLandschaft] = useState('')
  const [selectedNameType, setSelectedNameType] = useState('')
  const [enteredName, setEnteredName] = useState('')

  const [showInfo, setShowInfo] = useState(false)
  const [druckfarben, setDruckfarben] = useState<string[]>([])
  const [hobbyList, setHobbyList] = useState<{ name: string; thumbnail: string }[]>([])
  const [landschaften, setLandschaften] = useState<{ name: string; url: string }[]>([])
  const [search, setSearch] = useState('')

  const prevStepRef = useRef(step)

  useEffect(() => {
    const newIndex = config.flow.indexOf(step)
    setDirection(newIndex > prevIndex ? 1 : -1)
    setPrevIndex(newIndex)
  }, [step])

  useEffect(() => {
    const prevStep = prevStepRef.current
    if (prevStep === 'size') setSize(selectedSize)
    if (prevStep === 'color') setColor(selectedColor)
    if (prevStep === 'druckfarbe') setDruckfarbe(selectedDruckfarbe)
    if (prevStep === 'hobbys') setHobbys(selectedHobbys)
    if (prevStep === 'landschaft') setLandschaft(selectedLandschaft)
    if (prevStep === 'text') {
      setNameType(selectedNameType as any)
      if (selectedNameType === 'Name') setCustomName(enteredName)
    }
    prevStepRef.current = step
  }, [step])

  useEffect(() => {
    setSelectedSize(storeSize || '')
    setSelectedColor(storeColor || '')
    setSelectedDruckfarbe(storeDruckfarbe || '')
    setSelectedHobbys(storeHobbys || [])
    setSelectedLandschaft(storeLandschaft || '')
    setSelectedNameType(storeNameType || '')
    setEnteredName(storeCustomName || '')
  }, [storeSize, storeColor, storeDruckfarbe, storeHobbys, storeLandschaft, storeNameType, storeCustomName])

  useEffect(() => {
    if (step === 'druckfarbe') {
      fetch('https://strapi.prod-strapi-fra-01.surmatik.ch/api/typischich-druckfarben?fields=Farbe')
        .then((res) => res.json())
        .then((data) => {
          const farben = data.data.map((item: any) => item.Farbe)
          setDruckfarben(farben)
        })
    }
  }, [step])

  useEffect(() => {
    if (step === 'hobbys') {
      fetch('https://strapi.prod-strapi-fra-01.surmatik.ch/api/typischich-hobbys?populate=*&pagination[pageSize]=1000')
        .then((res) => res.json())
        .then((data) => {
          const hobbys = data.data.map((item: any) => ({
            name: item.Hobby,
            thumbnail: item.Motive?.formats?.thumbnail?.url || item.Motive?.url,
          }))
          setHobbyList(hobbys)
        })
    }
  }, [step])

  useEffect(() => {
    if (step === 'landschaft') {
      fetch('https://strapi.prod-strapi-fra-01.surmatik.ch/api/typisch-ich-landschaftens?populate=*')
        .then((res) => res.json())
        .then((data) => {
          if (!data || !Array.isArray(data.data)) {
            console.error('Landschaft: Unexpected API response', data)
            return
          }
          const lands = data.data.map((item: any) => ({
            id: item.id,
            name: item.Name,
            url: item.Landschaft?.formats?.large?.url || item.Landschaft?.url || '',
          }))
          setLandschaften(lands)
        })
        .catch((err) => {
          console.error('Landschaft: Fetch failed', err)
        })
    }
  }, [step])

  if (!config) return <p className="p-8">❌ Produkt nicht gefunden.</p>
  if (!config.flow.includes(step)) return <p className="p-8">❌ Ungültiger Schritt.</p>

  const next = getNextStep(product, step)

  const handleAddToShopifyCart = () => {
    const params = new URLSearchParams()
    params.set('id', config.id) // z. B. 51964063285577
  
    const properties: Record<string, string> = {
      Geschlecht: gender || '',
      Grösse: storeSize || '',
      Farbe: storeColor || '',
      Druckfarbe: storeDruckfarbe || '',
      Hobbys: storeHobbys?.join(', ') || '',
      Landschaft: storeLandschaft || '',
      Text: storeNameType === 'Name' ? (storeCustomName || '') : (storeNameType || ''),
      _KonfigID: `${Date.now()}-${Math.floor(Math.random() * 100000)}`
    }
  
    Object.entries(properties).forEach(([key, value]) => {
      params.set(`properties[${key}]`, value)
    })
  
    const url = `https://typischich.ch/cart/add?${params.toString()}`
    window.location.href = url // ⬅️ direkt weiterleiten wie gewünscht
  }
  
  

  return (
    <AnimatePresence mode="wait">
      <StepWrapper
        step={step}
        productSlug={product}
        steps={config.flow}
        title={config.title}
        setDirection={setDirection}
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.35 }}
        >

      {/* Step: Gender */}
      {step === 'gender' && config.genderOptions && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-[#262626]">Ich bin ...</h1>
          <div className="space-y-4">
            {config.genderOptions.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGender(g as any)
                  if (next) {
                    setDirection(1)
                    router.push(`/configurator/${product}/${next}`)
                  }
                }}
                className="w-full py-3 bg-gray-100 rounded-xl hover:bg-gray-200 border border-gray-300 text-[#262626]"
              >
                ... eine {g}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Step: Size */}
      {step === 'size' && config.sizes && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-[#262626]">Meine Grösse</h1>

          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4 bg-white text-[#262626]"
          >
            {config.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <div className="bg-gray-100 p-4 rounded-xl mb-4">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="font-semibold text-left w-full text-[#262626]"
            >
              {showInfo ? '– Grösseninformationen' : '+ Grösseninformationen'}
            </button>

            {showInfo && (
              <p className="text-sm text-gray-700 mt-2">
                Die Grössenangaben sind eher knapp bemessen. Beachte doch die Masstabelle für deine Entscheidung.
              </p>
            )}
          </div>

          <button
            disabled={!selectedSize || selectedSize === 'Wähle eine Grösse aus'}
            onClick={() => {
              setSize(selectedSize)
              if (next) {
                setDirection(1)
                router.push(`/configurator/${product}/${next}`)
              }
            }}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50"
          >
            Weiter
          </button>
        </>
      )}

      {/* Step: Color */}
      {step === 'color' && config.colors && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-[#262626]">T-Shirt Farbe wählen</h1>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4 bg-white text-[#262626]"
          >
            <option>Wähle deine Farbe aus</option>
            {config.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>

          <button
            disabled={!selectedColor || selectedColor === 'Wähle deine Farbe aus'}
            onClick={() => {
              setColor(selectedColor)
              if (next) {
                setDirection(1)
                router.push(`/configurator/${product}/${next}`)
              }
            }}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50"
          >
            Weiter
          </button>
        </>
      )}

      {/* Step: Druckfarbe */}
      {step === 'druckfarbe' && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-[#262626]">Wähle deine Druckfarbe</h1>

          <select
            value={selectedDruckfarbe}
            onChange={(e) => setSelectedDruckfarbe(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4 bg-white text-[#262626]"
          >
            <option>Wähle eine Druckfarbe aus</option>
            {druckfarben.map((farbe) => (
              <option key={farbe} value={farbe}>
                {farbe}
              </option>
            ))}
          </select>

          <button
            disabled={!selectedDruckfarbe || selectedDruckfarbe === 'Wähle eine Druckfarbe aus'}
            onClick={() => {
              setDruckfarbe(selectedDruckfarbe)
              if (next) {
                setDirection(1)
                router.push(`/configurator/${product}/${next}`)
              }
            }}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50"
          >
            Weiter
          </button>
        </>
      )}

    {step === 'hobbys' && typeof window !== 'undefined' && (

    <>
        <h1 className="text-2xl font-bold mb-6 text-[#262626]">Wähle bis zu 3 Hobbys</h1>

        <input
        type="text"
        placeholder="Suche nach Hobbys..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-xl mb-6 bg-white text-[#262626]"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {hobbyList
            .filter((h) => h.name.toLowerCase().includes(search.toLowerCase()))
            .map((hobby) => {
            const selected = selectedHobbys.includes(hobby.name)
            return (
                <div
                key={hobby.name}
                onClick={() => {
                    if (selected) {
                    setSelectedHobbys(selectedHobbys.filter((h) => h !== hobby.name))
                    } else if (selectedHobbys.length < 3) {
                    setSelectedHobbys([...selectedHobbys, hobby.name])
                    }
                }}
                className={`group cursor-pointer border rounded-xl p-2 flex flex-col items-center justify-between h-44 transition ${
                    selected ? 'scale-110 border-black bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                <div className="bg-black w-full h-28 flex items-center justify-center rounded-md overflow-hidden mb-2 px-4">
                    {hobby.thumbnail && (
                    <Image
                    src={`https://strapi.prod-strapi-fra-01.surmatik.ch${hobby.thumbnail}`}
                    alt={hobby.name}
                    width={80}
                    height={80}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                    )}
                </div>
                <p className="text-center text-sm text-[#262626]">{hobby.name}</p>
                </div>
            )
            })}
        </div>

        <button
        disabled={selectedHobbys.length === 0 || selectedHobbys.length > 3}
        onClick={() => {
            setHobbys(selectedHobbys)
            if (next) {
                setDirection(1)
                router.push(`/configurator/${product}/${next}`)
              }
        }}
        className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50"
        >
        Weiter
        </button>
    </>
    )}

    {step === 'landschaft' && (
    <>
        <h1 className="text-2xl font-bold mb-6 text-[#262626]">Landschaft</h1>

        <div className="space-y-4">
        {landschaften.map((l) => {
            const selected = selectedLandschaft === l.name
            return (
            <div
                key={l.id}
                onClick={() => setSelectedLandschaft(l.name)}
                className={`cursor-pointer rounded-xl border transition-all overflow-hidden bg-white group ${
                selected
                    ? 'border-black ring-2 ring-black shadow-md scale-[1.01]'
                    : 'border-gray-300 hover:shadow-md hover:ring-1 hover:ring-gray-400'
                }`}
            >
                <div className="p-2">
                <Image
                    src={`https://strapi.prod-strapi-fra-01.surmatik.ch${l.url}`}
                    alt={l.name}
                    width={1000}
                    height={200}
                    className="w-full h-auto rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
                </div>
                <p className="text-center text-sm py-2 text-[#262626] font-medium">{l.name}</p>
            </div>
            )
        })}
        </div>

        <button
        disabled={!selectedLandschaft}
        onClick={() => {
            setLandschaft(selectedLandschaft)
            if (next) {
                setDirection(1)
                router.push(`/configurator/${product}/${next}`)
              }
        }}
        className="w-full bg-black text-white py-3 mt-6 rounded-xl hover:bg-gray-900 disabled:opacity-50"
        >
        Weiter
        </button>
    </>
    )}

    {step === 'text' && (
    <>
        <h1 className="text-2xl font-bold mb-6 text-[#262626]">"Name" oder "Typisch Ich" unter das Motiv</h1>
        <div className="space-y-4 mb-6">
        {['Name', 'Typisch Ich', 'Nichts'].map((option) => (
            <button
            key={option}
            onClick={() => setSelectedNameType(option)}
            className={`w-full py-3 rounded-xl border text-[#262626] hover:bg-gray-50 transition ${
                selectedNameType === option ? 'bg-black text-white border-black' : 'bg-white border-gray-300'
            }`}
            >
            {option}
            </button>
        ))}
        </div>

        {selectedNameType === 'Name' && (
        <input
            type="text"
            placeholder="Gib deinen Namen ein"
            value={enteredName}
            onChange={(e) => setEnteredName(e.target.value)}
            className="w-full p-3 border rounded-xl mb-6 bg-white text-[#262626]"
        />
        )}

        <button
        disabled={!selectedNameType || (selectedNameType === 'Name' && enteredName.trim() === '')}
        onClick={() => {
            setNameType(selectedNameType as any)
            if (selectedNameType === 'Name') setCustomName(enteredName)
            if (next) {
            setDirection(1)
            router.push(`/configurator/${product}/${next}`)
            }
        }}
        className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50"
        >
        Weiter
        </button>
    </>
    )}

    {/* Step: Zusammenfassung */}
    {step === 'summary' && (
    <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6 text-[#262626]">Deine Auswahl</h1>
        <div className="p-8">
            <ul className="space-y-2 text-[#262626]">
              <li><strong>Geschlecht:</strong> {gender ?? '–'}</li>
              <li><strong>Grösse:</strong> {storeSize ?? '–'}</li>
              <li><strong>Farbe:</strong> {storeColor ?? '–'}</li>
              <li><strong>Druckfarbe:</strong> {storeDruckfarbe ?? '–'}</li>
              <li><strong>Hobbys:</strong> {storeHobbys?.length ? storeHobbys.join(', ') : '–'}</li>
              <li><strong>Landschaft:</strong> {storeLandschaft ?? '–'}</li>
              <li><strong>Text:</strong> {storeNameType === 'Name' ? (storeCustomName || '–') : (storeNameType ?? '–')}</li>
            </ul>
            <button
              onClick={handleAddToShopifyCart}
              className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-900"
            >
              Zum Warenkorb hinzufügen
            </button>
          </div>
    </div>
    )}


      {/* Default Step */}
      {!['gender', 'size', 'color', 'druckfarbe', 'hobbys', 'landschaft', 'text', 'summary'].includes(step) && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-[#262626]">{step}</h1>
          <p className="text-gray-600">Fehler</p>

          {next && (
            <button
              onClick={() => router.push(`/configurator/${product}/${next}`)}
              className="w-full bg-black text-white py-3 mt-6 rounded-xl hover:bg-gray-900"
            >
              Weiter
            </button>
          )}
        </>
      )}
    </motion.div>
  </StepWrapper>
</AnimatePresence>
)
}