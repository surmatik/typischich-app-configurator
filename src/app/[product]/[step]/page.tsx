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

    if (!config || !Array.isArray(config.colors)) {
    return <p className="p-8">❌ Produkt nicht gefunden oder keine Farben verfügbar.</p>
    }

  const currentIndex = config.flow.indexOf(step)
  const [prevIndex, setPrevIndex] = useState(currentIndex)
  const [direction, setDirection] = useState(0)

  const [hasMounted, setHasMounted] = useState(false)

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

  const [hoodieFarben, setHoodieFarben] = useState<{ name: string; url: string }[]>([])
  const [hoodieKidsFarben, setHoodieKidsFarben] = useState<{ name: string; url: string }[]>([])

  const [showInfo, setShowInfo] = useState(false)
  const [druckfarben, setDruckfarben] = useState<{ name: string; code: string }[]>([])
  const [hobbyList, setHobbyList] = useState<{ name: string; thumbnail: string }[]>([])
  const [landschaften, setLandschaften] = useState<{ id: number; name: string; url: string }[]>([])
  const [search, setSearch] = useState('')

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const prevHobbysRef = useRef<string[]>([])


  useEffect(() => {
    const newIndex = config.flow.indexOf(step)
    setDirection(newIndex > prevIndex ? 1 : -1)
    setPrevIndex(newIndex)
  }, [step])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Size
  useEffect(() => {
    if (selectedSize && selectedSize !== storeSize) {
      setSize(selectedSize)
    }
  }, [selectedSize, storeSize])

  // Color
  useEffect(() => {
    if (selectedColor && selectedColor !== storeColor) {
      setColor(selectedColor)
    }
  }, [selectedColor, storeColor])

  // Druckfarbe
  useEffect(() => {
    if (selectedDruckfarbe && selectedDruckfarbe !== storeDruckfarbe) {
      setDruckfarbe(selectedDruckfarbe)
    }
  }, [selectedDruckfarbe, storeDruckfarbe])

  // Hobbys
  useEffect(() => {
    const current = JSON.stringify(selectedHobbys)
    const prev = JSON.stringify(prevHobbysRef.current)
    if (current !== prev) {
      setHobbys(selectedHobbys)
      prevHobbysRef.current = selectedHobbys
    }
  }, [selectedHobbys])

  // Landschaft
  useEffect(() => {
    if (selectedLandschaft && selectedLandschaft !== storeLandschaft[0]) {
      setLandschaft([selectedLandschaft])
    }
  }, [selectedLandschaft, storeLandschaft])

  // Textauswahl (Name, Typisch Ich, Nichts)
  useEffect(() => {
    if (selectedNameType && selectedNameType !== storeNameType) {
      setNameType(selectedNameType)
    }
  }, [selectedNameType, storeNameType])

  // Eingetippter Name
  useEffect(() => {
    if (selectedNameType === 'Name' && enteredName !== storeCustomName) {
      setCustomName(enteredName)
    }
  }, [enteredName, selectedNameType, storeCustomName])


  useEffect(() => {
    setSelectedSize(storeSize || '')
    setSelectedColor(storeColor || '')
    setSelectedDruckfarbe(storeDruckfarbe || '')
    setSelectedHobbys(storeHobbys || [])
    setSelectedLandschaft(storeLandschaft[0] || '')
    setSelectedNameType(storeNameType || '')
    setEnteredName(storeCustomName || '')
  }, [storeSize, storeColor, storeDruckfarbe, storeHobbys, storeLandschaft, storeNameType, storeCustomName])

  useEffect(() => {
    if (step === 'druckfarbe') {
      fetch('https://strapi.prod-strapi-fra-01.surmatik.ch/api/typischich-druckfarben')
        .then((res) => res.json())
        .then((data) => {
          const farben = data.data.map((item: any) => ({
            name: item.Farbe,
            code: item.Code,
          }))
          setDruckfarben(farben)
        })
    }
  }, [step])

  useEffect(() => {
    if (step !== 'color') return;
  
    const fetchColors = async () => {
      if (product.includes('hoodie-fuer-kids')) {
        const res = await fetch('https://strapi.prod-strapi-fra-01.surmatik.ch/api/typisch-ich-hoodie-kids-farbens?populate=*')
        const data = await res.json()
        if (!data || !Array.isArray(data.data)) {
          console.error('❌ Fehler beim Laden der Farben:', data)
          return
        }
        const farben = data.data.map((item: any) => ({
          name: item.Farbe,
          url: item.Bild?.formats?.thumbnail?.url || item.Bild?.url || '',
        }))
        setHoodieKidsFarben(farben)
      } else if (product.includes('hoodie')) {
        const res = await fetch('https://strapi.prod-strapi-fra-01.surmatik.ch/api/typisch-ich-hoodie-farbens?populate=*')
        const data = await res.json()
        if (!data || !Array.isArray(data.data)) {
          console.error('❌ Fehler beim Laden der Farben:', data)
          return
        }
        const farben = data.data.map((item: any) => ({
          name: item.Farbe,
          url: item.Bild?.formats?.thumbnail?.url || item.Bild?.url || '',
        }))
        setHoodieFarben(farben)
      }
    }
  
    fetchColors()
  }, [step])

  useEffect(() => {
    if (step !== 'hobbys') return
  
    const fetchAllHobbys = async () => {
      let allHobbys: { name: string; thumbnail: string }[] = []
      let page = 1
      let finished = false
  
      while (!finished) {
        const res = await fetch(
          `https://strapi.prod-strapi-fra-01.surmatik.ch/api/typischich-hobbys?populate=*&pagination[page]=${page}&pagination[pageSize]=100`
        )
        const data = await res.json()
        const currentPageHobbys = data.data.map((item: any) => ({
          name: item.Hobby,
          thumbnail: item.Motive?.formats?.thumbnail?.url || item.Motive?.url,
        }))
  
        allHobbys = [...allHobbys, ...currentPageHobbys]
  
        if (data.data.length < 100) {
          finished = true
        } else {
          page++
        }
      }
  
      setHobbyList(allHobbys)
    }
  
    fetchAllHobbys()
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
      Landschaft: storeLandschaft[0] || '',
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
            {config.genderOptions.map((g) => {
              const artikel = g.toLowerCase() === 'mann' || g.toLowerCase() === 'kind' ? 'ein' : 'eine'
              return (
                <button
                  key={g}
                  onClick={() => {
                    setGender(g as any)
                    if (next) {
                      setDirection(1)
                      router.push(`/${product}/${next}`)
                    }
                  }}
                  className="w-full py-3 bg-gray-100 rounded-xl hover:bg-gray-200 border border-gray-300 text-[#262626]"
                >
                  ... {artikel} {g}
                </button>
              )
            })}
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
            <>
              <p className="text-sm text-gray-700 mt-2">
                Die Grössenangaben sind eher knapp bemessen. Beachte doch die Masstabelle für deine Entscheidung.
              </p>

              <div className="flex flex-col space-y-6 mt-6">
              {(product.includes('tshirt') || product.includes('t-shirt') || product.includes('gipfelstuermer')) && !product.includes('kinder-tshirt') && (
                <div className="flex flex-col space-y-6 mt-6">
                  <img
                    src="https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/T_Shirt_Groessenangaben_Frauen_5a6a8414c2.png"
                    alt="T-Shirt Frauen"
                    className="w-full h-auto object-contain rounded-xl shadow cursor-zoom-in"
                    onClick={() => setSelectedImage('https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/T_Shirt_Groessenangaben_Frauen_5a6a8414c2.png')}
                  />
                  <img
                    src="https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/T_Shirt_Groessenangaben_Herren_6a23b8e615.png"
                    alt="T-Shirt Herren"
                    className="w-full h-auto object-contain rounded-xl shadow cursor-zoom-in"
                    onClick={() => setSelectedImage('https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/T_Shirt_Groessenangaben_Herren_6a23b8e615.png')}
                  />
                </div>
              )}
              {product.includes('kinder-tshirt') && (
                <div className="flex flex-col space-y-6 mt-6">
                  <img
                    src="https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/T_Shirt_Groessenangaben_K_Inder_393a9b4a80.png"
                    alt="Hoodie Kids"
                    className="w-full h-auto object-contain rounded-xl shadow cursor-zoom-in"
                    onClick={() => setSelectedImage('https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/T_Shirt_Groessenangaben_K_Inder_393a9b4a80.png')}
                  />
                </div>
              )}
              {product.includes('hoodie')  && !product.includes('hoodie-fuer-kids') && (
                <div className="flex flex-col space-y-6 mt-6">
                  <img
                    src="https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Hoodie_Groessenangaben_Frauen_e91092f47c.png"
                    alt="Hoodie Frauen"
                    className="w-full h-auto object-contain rounded-xl shadow cursor-zoom-in"
                    onClick={() => setSelectedImage('https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Hoodie_Groessenangaben_Frauen_e91092f47c.png')}
                  />
                  <img
                    src="https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Hoodie_Groessenangaben_Herren_0fe478501c.png"
                    alt="Hoodie Herren"
                    className="w-full h-auto object-contain rounded-xl shadow cursor-zoom-in"
                    onClick={() => setSelectedImage('https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Hoodie_Groessenangaben_Herren_0fe478501c.png')}
                  />
                </div>
              )}
              {product.includes('hoodie-fuer-kids') && (
                <div className="flex flex-col space-y-6 mt-6">
                  <img
                    src="https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Hoodie_Groessenangaben_K_Inder_7c9fac9543.png"
                    alt="Hoodie Kids"
                    className="w-full h-auto object-contain rounded-xl shadow cursor-zoom-in"
                    onClick={() => setSelectedImage('https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Hoodie_Groessenangaben_K_Inder_7c9fac9543.png')}
                  />
                </div>
              )}
              {product.includes('pullover') && (
                <div className="flex flex-col space-y-6 mt-6">
                  <img
                    src="https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Pullover_Groessenangaben_Frauen_d84b999d71.png"
                    alt="Pullover Frauen"
                    className="w-full h-auto object-contain rounded-xl shadow cursor-zoom-in"
                    onClick={() => setSelectedImage('https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Pullover_Groessenangaben_Frauen_d84b999d71.png')}
                  />
                  <img
                    src="https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Pullover_Groessenangaben_Herren_b1a6c98cae.png"
                    alt="Pullover Herren"
                    className="w-full h-auto object-contain rounded-xl shadow cursor-zoom-in"
                    onClick={() => setSelectedImage('https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Pullover_Groessenangaben_Herren_b1a6c98cae.png')}
                  />
                </div>
              )}


              {selectedImage && (
                <div
                  className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50"
                  onClick={() => setSelectedImage(null)}
                >
                  <div
                    className="relative bg-white p-4 rounded-lg max-w-4xl w-[90%]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Schliessen-Button */}
                    <button
                      className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black"
                      onClick={() => setSelectedImage(null)}
                      aria-label="Schliessen"
                    >
                      &times;
                    </button>

                    <img
                      src={selectedImage}
                      alt="Vollbild"
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
              </div>

            </>
  )}

          </div>

          <button
            disabled={!selectedSize || selectedSize === 'Wähle eine Grösse aus'}
            onClick={() => {
              setSize(selectedSize)
              if (next) {
                setDirection(1)
                router.push(`/${product}/${next}`)
              }
            }}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50"
          >
            Weiter
          </button>
        </>
      )}

      {/* Step: Color */}
      {step === 'color' && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-[#262626]">
            {product.includes('tshirt')
              ? 'T-Shirt Farbe wählen'
              : product.includes('hoodie')
              ? 'Hoodie Farbe wählen'
              : product.includes('beanie')
              ? 'Beanie Farbe wählen'
              : product.includes('filz-bag')
              ? 'Filz-Bag Farbe wählen'
              : 'Farbe wählen'}
          </h1>

          {product.includes('hoodie') ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {(product.includes('hoodie-fuer-kids') ? hoodieKidsFarben : hoodieFarben).map((farbe) => {
                const selected = selectedColor === farbe.name
                return (
                  <div
                    key={farbe.name}
                    onClick={() => setSelectedColor(farbe.name)}
                    className={`group cursor-pointer border rounded-xl p-2 flex flex-col items-center justify-between h-44 transition ${
                      selected ? 'scale-110 border-black bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-full h-28 flex items-center justify-center rounded-md overflow-hidden mb-2">
                      {farbe.url && (
                        <Image
                          src={`https://strapi.prod-strapi-fra-01.surmatik.ch${farbe.url}`}
                          alt={farbe.name}
                          width={80}
                          height={80}
                          className="object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <p className="text-center text-sm text-[#262626]">{farbe.name}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full p-3 border rounded-xl mb-4 bg-white text-[#262626]"
              >
                <option>Wähle deine Farbe aus</option>
                {config.colors?.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </>
          )}

          <button
            disabled={!selectedColor || selectedColor === 'Wähle deine Farbe aus'}
            onClick={() => {
              setColor(selectedColor)
              if (next) {
                setDirection(1)
                router.push(`/${product}/${next}`)
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

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
            {druckfarben.map((farbe) => {
              const selected = selectedDruckfarbe === farbe.name
              return (
                <div
                  key={farbe.name}
                  onClick={() => setSelectedDruckfarbe(farbe.name)}
                  className={`cursor-pointer rounded-xl flex flex-col items-center justify-center border p-2 transition ${
                    selected ? 'border-black ring-2 ring-black scale-105' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full mb-2 border border-gray-300"
                    style={{ backgroundColor: farbe.code || '#fff' }}
                  />
                  <p className="text-sm text-[#262626]">{farbe.name}</p>
                </div>
              )
            })}
          </div>

          <button
            disabled={!selectedDruckfarbe}
            onClick={() => {
              setDruckfarbe(selectedDruckfarbe)
              if (next) {
                setDirection(1)
                router.push(`/${product}/${next}`)
              }
            }}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50"
          >
            Weiter
          </button>
        </>
      )}


{/* Step: Hobbys */}
    {step === 'hobbys' && hasMounted && typeof window !== 'undefined' && (
    <>
        <h1 className="text-2xl font-bold mb-6 text-[#262626]">
          {config.maxHobbys === 1 ? 'Wähle ein Hobby' : `Wähle bis zu ${config.maxHobbys ?? 3} Hobbys`}
        </h1>

        <input
        type="text"
        placeholder="Suche nach Hobbys..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-xl mb-6 bg-white text-[#262626]"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {hobbyList
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((h) => h.name.toLowerCase().includes(search.toLowerCase()))
            .map((hobby) => {
            const selected = selectedHobbys.includes(hobby.name)
            return (
                <div
                key={hobby.name}
                onClick={() => {
                    if (selected) {
                    setSelectedHobbys(selectedHobbys.filter((h) => h !== hobby.name))
                    } else if (selectedHobbys.length < (config.maxHobbys || 3)) {
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
                    className="object-contain transition-transform duration-300 group-hover:scale-110 hobby-image"
                  />
                    )}
                </div>
                <p className="text-center text-sm text-[#262626]">{hobby.name}</p>
                </div>
            )
            })}
        </div>

        <button
        disabled={selectedHobbys.length === 0 || selectedHobbys.length > (config.maxHobbys || 3)}
        onClick={() => {
            setHobbys(selectedHobbys)
            if (next) {
                setDirection(1)
                router.push(`/${product}/${next}`)
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
                <p className="text-center text-sm py-2 text-[#262626] font-medium">{l.name} (Beispiel)</p>
            </div>
            )
        })}
        </div>

        <button
        disabled={!selectedLandschaft}
        onClick={() => {
            setLandschaft([selectedLandschaft])
            if (next) {
                setDirection(1)
                router.push(`/${product}/${next}`)
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
        {product === 'mein-persoenlicher-schluesselanhaenger' ? (
          <>
            <h1 className="text-2xl font-bold mb-6 text-[#262626]">Name oder Bezeichnung</h1>
            <input
              type="text"
              placeholder="z. B. Büro, Camper, Gartenhaus, Briefkasten, Werkstatt …"
              value={enteredName}
              onChange={(e) => setEnteredName(e.target.value)}
              className="w-full p-3 border rounded-xl mb-6 bg-white text-[#262626]"
            />

            <button
              disabled={enteredName.trim() === ''}
              onClick={() => {
                setNameType('Name')
                setCustomName(enteredName)
                if (next) {
                  setDirection(1)
                  router.push(`/${product}/${next}`)
                }
              }}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50"
            >
              Weiter
            </button>
          </>
        ) : (
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
                  router.push(`/${product}/${next}`)
                }
              }}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50"
            >
              Weiter
            </button>
          </>
        )}
      </>
    )}


    {/* Step: Zusammenfassung */}
    {step === 'summary' && (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6 text-[#262626]">Deine Auswahl</h1>
        <div className="p-8">
          <ul className="space-y-2 text-[#262626]">
            {config.flow.includes('gender') && (
              <li><strong>Geschlecht:</strong> {gender ?? '–'}</li>
            )}
            {config.flow.includes('size') && (
              <li><strong>Grösse:</strong> {storeSize ?? '–'}</li>
            )}
            {config.flow.includes('color') && (
              <li><strong>Farbe:</strong> {storeColor ?? '–'}</li>
            )}
            {config.flow.includes('druckfarbe') && (
              <li><strong>Druckfarbe:</strong> {storeDruckfarbe ?? '–'}</li>
            )}
            {config.flow.includes('hobbys') && (
              <li><strong>Hobbys:</strong> {storeHobbys?.length ? storeHobbys.join(', ') : '–'}</li>
            )}
            {config.flow.includes('landschaft') && (
              <li><strong>Landschaft:</strong> {storeLandschaft ?? '–'}</li>
            )}
            {config.flow.includes('text') && (
              <li><strong>Text:</strong> {storeNameType === 'Name' ? (storeCustomName || '–') : (storeNameType ?? '–')}</li>
            )}
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
              onClick={() => router.push(`/${product}/${next}`)}
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