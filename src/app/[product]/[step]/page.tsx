'use client'

import { useParams, useRouter } from 'next/navigation'
import { getNextStep, getProductConfigBySlug } from '@/lib/getProductConfig'
import {
  type ConfiguratorDraft,
  type Gender,
  useConfiguratorStore,
} from '@/state/configuratorStore'
import StepWrapper from '@/components/StepWrapper'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

const CONFIG_DRAFT_STORAGE_PREFIX = 'typischich-configurator-draft:'
const BEANIE_LEATHER_BACKGROUND_URL =
  'https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Leder_neu_a1f61cdd53.JPG'
const FILZ_BACKGROUND_URL =
  'https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Filz_verbessert_8dd6492265.JPG'
const FILZ_BAG_LIGHT_BACKGROUND_URL =
  'https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Heller_Filzbag_neu_6c2e27aed6.JPG'
const FILZ_BAG_DARK_BACKGROUND_URL =
  'https://strapi.prod-strapi-fra-01.surmatik.ch/uploads/Dunkler_Filzbag_neu_7d76757452.JPG'

const getDraftStorageKey = (productSlug: string) =>
  `${CONFIG_DRAFT_STORAGE_PREFIX}${productSlug}`

const hasDraftSelections = (draft: ConfiguratorDraft) => {
  const hasStepSelections = Object.values(draft.stepSelections).some((selections) =>
    selections.some((value) => Boolean(value?.trim()))
  )

  return Boolean(
    draft.gender ||
      draft.size ||
      draft.color ||
      draft.druckfarbe ||
      draft.nameType ||
      draft.customName.trim() ||
      draft.hobbys.length ||
      draft.landschaft.length ||
      hasStepSelections
  )
}

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
  const stepSelections = useConfiguratorStore((s) => s.stepSelections)
  const setStepSelections = useConfiguratorStore((s) => s.setStepSelections)
  const hydrateConfigurator = useConfiguratorStore((s) => s.hydrateConfigurator)
  const resetConfigurator = useConfiguratorStore((s) => s.resetConfigurator)

  const multiStepSelectionConfig = config.multiStepSelection
  const multiSelectionCount = multiStepSelectionConfig?.count ?? 1

  const isMultiStepSelection = (stepName: string) =>
    Boolean(
      multiStepSelectionConfig &&
        multiSelectionCount > 1 &&
        multiStepSelectionConfig.steps.includes(stepName)
    )

  const getSelectionLabel = (index: number) =>
    multiStepSelectionConfig?.labels?.[index] || `Shirt ${index + 1}`

  const getStepSelections = (stepName: string): string[] => {
    const values = stepSelections[stepName] || []
    if (!isMultiStepSelection(stepName)) return values

    return Array.from({ length: multiSelectionCount }, (_, index) => values[index] || '')
  }

  const updateStepSelectionAt = (stepName: string, index: number, value: string) => {
    const currentValues = getStepSelections(stepName)
    const nextValues = [...currentValues]
    nextValues[index] = value
    setStepSelections(stepName, nextValues)
  }

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedDruckfarbe, setSelectedDruckfarbe] = useState('')
  const [selectedHobbys, setSelectedHobbys] = useState<string[]>([])
  const [selectedLandschaft, setSelectedLandschaft] = useState('')
  const [selectedNameType, setSelectedNameType] = useState('')
  const [enteredName, setEnteredName] = useState('')

  const [hoodieFarben, setHoodieFarben] = useState<{ name: string; url: string }[]>([])
  const [hoodieKidsFarben, setHoodieKidsFarben] = useState<{ name: string; url: string }[]>([])
  const [pulloverFarben, setPulloverFarben] = useState<{ name: string; url: string }[]>([])
  const [beanieFarben, setBeanieFarben] = useState<{ name: string; url: string }[]>([])

  const [showInfo, setShowInfo] = useState(false)
  const [druckfarben, setDruckfarben] = useState<{ name: string; code: string }[]>([])
  const [hobbyList, setHobbyList] = useState<{ name: string; thumbnail: string }[]>([])
  const [landschaften, setLandschaften] = useState<{ id: number; name: string; url: string }[]>([])
  const [search, setSearch] = useState('')

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [summaryPreviewIndex, setSummaryPreviewIndex] = useState(0)
  const [hydratedDraftProduct, setHydratedDraftProduct] = useState<string | null>(null)

  const prevHobbysRef = useRef<string[]>([])
  const storeSyncLockRef = useRef(true)

  const clearLocalSelections = () => {
    setSelectedSize('')
    setSelectedColor('')
    setSelectedDruckfarbe('')
    setSelectedHobbys([])
    setSelectedLandschaft('')
    setSelectedNameType('')
    setEnteredName('')
    prevHobbysRef.current = []
  }


  useEffect(() => {
    const newIndex = config.flow.indexOf(step)
    setDirection(newIndex > prevIndex ? 1 : -1)
    setPrevIndex(newIndex)
  }, [step])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (summaryPreviewIndex >= multiSelectionCount) {
      setSummaryPreviewIndex(0)
    }
  }, [summaryPreviewIndex, multiSelectionCount])

  useEffect(() => {
    setSummaryPreviewIndex(0)
  }, [product])

  useEffect(() => {
    if (typeof window === 'undefined') return

    storeSyncLockRef.current = true
    clearLocalSelections()
    setHydratedDraftProduct(null)
    const storageKey = getDraftStorageKey(product)
    const rawDraft = window.localStorage.getItem(storageKey)

    if (!rawDraft) {
      resetConfigurator()
      setHydratedDraftProduct(product)
      return
    }

    try {
      const parsedDraft = JSON.parse(rawDraft) as Partial<ConfiguratorDraft>
      hydrateConfigurator(parsedDraft)
    } catch (error) {
      console.error('Konfiguration konnte nicht geladen werden:', error)
      window.localStorage.removeItem(storageKey)
      resetConfigurator()
    } finally {
      setHydratedDraftProduct(product)
    }
  }, [product, hydrateConfigurator, resetConfigurator])

  // Size
  useEffect(() => {
    if (storeSyncLockRef.current) return
    if (selectedSize && selectedSize !== storeSize) {
      setSize(selectedSize)
    }
  }, [selectedSize, storeSize])

  // Color
  useEffect(() => {
    if (storeSyncLockRef.current) return
    if (selectedColor && selectedColor !== storeColor) {
      setColor(selectedColor)
    }
  }, [selectedColor, storeColor])

  // Druckfarbe
  useEffect(() => {
    if (storeSyncLockRef.current) return
    if (selectedDruckfarbe && selectedDruckfarbe !== storeDruckfarbe) {
      setDruckfarbe(selectedDruckfarbe)
    }
  }, [selectedDruckfarbe, storeDruckfarbe])

  // Hobbys
  useEffect(() => {
    if (storeSyncLockRef.current) return
    const current = JSON.stringify(selectedHobbys)
    const prev = JSON.stringify(prevHobbysRef.current)
    if (current !== prev) {
      setHobbys(selectedHobbys)
      prevHobbysRef.current = selectedHobbys
    }
  }, [selectedHobbys])

  // Landschaft
  useEffect(() => {
    if (storeSyncLockRef.current) return
    if (selectedLandschaft && selectedLandschaft !== storeLandschaft[0]) {
      setLandschaft([selectedLandschaft])
    }
  }, [selectedLandschaft, storeLandschaft])

  // Textauswahl (Name, Typisch Ich, Nichts)
  useEffect(() => {
    if (storeSyncLockRef.current) return
    if (selectedNameType && selectedNameType !== storeNameType) {
      setNameType(selectedNameType)
    }
  }, [selectedNameType, storeNameType])

  // Eingetippter Name
  useEffect(() => {
    if (storeSyncLockRef.current) return
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
    storeSyncLockRef.current = false
  }, [storeSize, storeColor, storeDruckfarbe, storeHobbys, storeLandschaft, storeNameType, storeCustomName])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (hydratedDraftProduct !== product) return

    const storageKey = getDraftStorageKey(product)
    const draft: ConfiguratorDraft = {
      gender,
      size: storeSize,
      color: storeColor,
      druckfarbe: storeDruckfarbe,
      hobbys: storeHobbys || [],
      landschaft: storeLandschaft || [],
      nameType: storeNameType,
      customName: storeCustomName || '',
      stepSelections,
    }

    if (hasDraftSelections(draft)) {
      window.localStorage.setItem(storageKey, JSON.stringify(draft))
      return
    }

    window.localStorage.removeItem(storageKey)
  }, [
    hydratedDraftProduct,
    product,
    gender,
    storeSize,
    storeColor,
    storeDruckfarbe,
    storeHobbys,
    storeLandschaft,
    storeNameType,
    storeCustomName,
    stepSelections,
  ])

  useEffect(() => {
    if (step === 'druckfarbe' || step === 'summary') {
      let apiUrl = 'https://strapi.prod-strapi-fra-01.surmatik.ch/api/typischich-druckfarben';
      
      if (product === 'mein-persoenlicher-rucksack') {
        apiUrl += '?filters[Rucksack][$eq]=true';
      }

      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          if (!data.data) return;
          
          const farben = data.data.map((item: any) => ({
            name: item.Farbe,
            code: item.Code,
            rucksack: item.Rucksack
          }))
          setDruckfarben(farben)
        })
        .catch((err) => console.error("Fehler beim Laden der Druckfarben:", err));
    }
  }, [step, product]);

  useEffect(() => {
    if (step !== 'color' && step !== 'summary') return;
  
    const fetchColors = async () => {
      if (product.includes('hoodie-fuer-kids')) {
        const res = await fetch('https://strapi.prod-strapi-fra-01.surmatik.ch/api/typisch-ich-hoodie-kids-farbens?populate=*');
        const data = await res.json();
        if (!data || !Array.isArray(data.data)) {
          console.error('❌ Fehler beim Laden der Farben (Kids):', data);
          return;
        }
        const farben = data.data.map((item: any) => ({
          name: item.Farbe,
          url: item.Bild?.formats?.thumbnail?.url || item.Bild?.url || '',
        }));
        setHoodieKidsFarben(farben);
      } else if (product.includes('hoodie')) {
        const res = await fetch('https://strapi.prod-strapi-fra-01.surmatik.ch/api/typisch-ich-hoodie-farbens?populate=*');
        const data = await res.json();
        if (!data || !Array.isArray(data.data)) {
          console.error('❌ Fehler beim Laden der Farben (Hoodie):', data);
          return;
        }
        const farben = data.data.map((item: any) => ({
          name: item.Farbe,
          url: item.Bild?.formats?.thumbnail?.url || item.Bild?.url || '',
        }));
        setHoodieFarben(farben);
      } else if (product.includes('pullover')) {
        const res = await fetch('https://strapi.prod-strapi-fra-01.surmatik.ch/api/typisch-ich-pullover-farbens?populate=*');
        const data = await res.json();
        if (!data || !Array.isArray(data.data)) {
          console.error('❌ Fehler beim Laden der Farben (Pullover):', data);
          return;
        }
        const farben = data.data.map((item: any) => ({
          name: item.Farbe,
          url: item.Bild?.formats?.thumbnail?.url || item.Bild?.url || '',
        }));
        setPulloverFarben(farben);
      } else if (product.includes('beanie')) {
        const beanieApiCandidates = [
          'https://strapi.prod-strapi-fra-01.surmatik.ch/api/typisch-ich-beanie-farbens?populate=*',
          'https://strapi.prod-strapi-fra-01.surmatik.ch/api/typisch-ich-beanie-farben?populate=*',
          'https://strapi.prod-strapi-fra-01.surmatik.ch/api/typischich-beanie-farbens?populate=*',
          'https://strapi.prod-strapi-fra-01.surmatik.ch/api/typischich-beanie-farben?populate=*',
        ]

        let loadedFarben: { name: string; url: string }[] | null = null

        for (const endpoint of beanieApiCandidates) {
          try {
            const res = await fetch(endpoint)
            if (!res.ok) continue

            const data = await res.json()
            if (!data || !Array.isArray(data.data)) continue

            const farben = data.data
              .map((item: any) => ({
                name: item.Farbe || item.farbe || item.Name || item.name || '',
                url:
                  item.Bild?.formats?.thumbnail?.url ||
                  item.Bild?.url ||
                  item.bild?.formats?.thumbnail?.url ||
                  item.bild?.url ||
                  '',
              }))
              .filter((farbe: { name: string }) => Boolean(farbe.name))

            if (farben.length > 0) {
              loadedFarben = farben
              break
            }
          } catch {
            // Try next endpoint candidate.
          }
        }

        if (!loadedFarben) {
          console.error('Fehler beim Laden der Farben (Beanie): kein gueltiger Endpoint oder keine Public-Rechte.')
          setBeanieFarben([])
          return
        }

        setBeanieFarben(loadedFarben)
      }
    };

  
    fetchColors()
  }, [step, product])

  useEffect(() => {
    if (step !== 'hobbys' && step !== 'summary') return
  
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
    if (step === 'landschaft' || step === 'summary') {
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
  const genderSelections = getStepSelections('gender')
  const sizeSelections = getStepSelections('size')
  const colorSelections = getStepSelections('color')
  const druckfarbeSelections = getStepSelections('druckfarbe')
  const isTshirtProduct =
    product.includes('tshirt') || product.includes('t-shirt') || product.includes('t-shirts')
  const hasMultiStepSummaryColumns = ['gender', 'size', 'color', 'druckfarbe'].some(
    (stepName) => config.flow.includes(stepName) && isMultiStepSelection(stepName)
  )
  const activeSummaryPreviewIndex = Math.min(summaryPreviewIndex, Math.max(multiSelectionCount - 1, 0))
  const getSummaryPreviewLabel = (index: number) =>
    isTshirtProduct ? `T-Shirt ${index + 1}` : getSelectionLabel(index)
  const landschaftValue = storeLandschaft?.[0] || ''
  const landschaftPreviewUrl = landschaftValue ? getLandschaftPreviewUrl(landschaftValue) : null
  const textValue = storeNameType === 'Name' ? (storeCustomName || '') : (storeNameType || '')

  const colorOptionsWithImages = product.includes('hoodie-fuer-kids')
    ? hoodieKidsFarben
    : product.includes('hoodie')
    ? hoodieFarben
    : product.includes('pullover')
    ? pulloverFarben
    : product.includes('beanie')
    ? beanieFarben
    : []
  const hasImageColorChoices =
    (product.includes('hoodie') || product.includes('pullover') || product.includes('beanie')) &&
    colorOptionsWithImages.length > 0

  const goToNextStep = () => {
    if (!next) return
    setDirection(1)
    router.push(`/${product}/${next}`)
  }

  const isSizeValueValid = (value: string) =>
    Boolean(value && value !== 'Wähle eine Grösse aus')

  const isColorValueValid = (value: string) =>
    Boolean(value && value !== 'Wähle deine Farbe aus')

  const isSharedStepSelection = (stepName: string) =>
    Boolean(
      multiStepSelectionConfig &&
        multiSelectionCount > 1 &&
        config.flow.includes(stepName) &&
        !isMultiStepSelection(stepName)
    )

  const getSharedSelectionHintText = (stepName: string) => {
    if (!multiStepSelectionConfig || multiSelectionCount <= 1) return ''

    const sharedStepSubjects: Record<string, string> = {
      hobbys: 'Die gewählten Hobbys',
      landschaft: 'Die gewählte Landschaft',
      text: 'Der gewählte Text',
    }
    const sharedStepVerbs: Record<string, string> = {
      hobbys: 'gelten',
      landschaft: 'gilt',
      text: 'gilt',
    }

    const subject = sharedStepSubjects[stepName] || 'Diese Auswahl'
    const verb = sharedStepVerbs[stepName] || 'gilt'

    if (multiSelectionCount === 2) {
      return `${subject} ${verb} für beide T-Shirts.`
    }

    return `${subject} ${verb} für alle T-Shirts.`
  }

  const isGenderValue = (value: string): value is Gender =>
    value === 'Frau' || value === 'Mann' || value === 'Kind'

  function normalizeValue(value: string) {
    return value.trim().toLowerCase()
  }

  const flatColorMap: Record<string, string> = {
    schwarz: '#111111',
    weiss: '#ffffff',
    grau: '#9ca3af',
    dunkelgrau: '#4b5563',
    hellgrau: '#d1d5db',
    rot: '#e11d48',
    'bordeaux rot': '#7f1d1d',
    orange: '#f97316',
    gelb: '#facc15',
    blau: '#2563eb',
    dunkelblau: '#1e3a8a',
    hellblau: '#7dd3fc',
    eisblau: '#bfdbfe',
    violett: '#7c3aed',
    pink: '#ec4899',
    'soft rosa': '#f9a8d4',
    gruen: '#16a34a',
    grün: '#16a34a',
    hellgruen: '#84cc16',
    hellgrün: '#84cc16',
    grüngelb: '#a3e635',
    grungelb: '#a3e635',
    eisgruen: '#bbf7d0',
    eisgrün: '#bbf7d0',
    waldgruen: '#166534',
    waldgrün: '#166534',
    olivegruen: '#4d7c0f',
    olivegrün: '#4d7c0f',
    schokoladenbraun: '#7c2d12',
  }

  const getFlatColorCode = (colorName: string) => {
    const key = normalizeValue(colorName)
    return flatColorMap[key] || null
  }

  const getColorPreviewImageUrl = (colorName: string) => {
    const match = colorOptionsWithImages.find(
      (farbe) => normalizeValue(farbe.name) === normalizeValue(colorName)
    )
    if (!match?.url) return null
    return `https://strapi.prod-strapi-fra-01.surmatik.ch${match.url}`
  }

  const getDruckfarbeCode = (farbeName: string) => {
    const match = druckfarben.find(
      (farbe) => normalizeValue(farbe.name) === normalizeValue(farbeName)
    )
    return match?.code || null
  }

  const getHobbyThumbnailUrl = (hobbyName: string) => {
    const match = hobbyList.find(
      (hobby) => normalizeValue(hobby.name) === normalizeValue(hobbyName)
    )
    if (!match?.thumbnail) return null
    return `https://strapi.prod-strapi-fra-01.surmatik.ch${match.thumbnail}`
  }

  function getLandschaftPreviewUrl(landschaftName: string) {
    const match = landschaften.find(
      (landschaftItem) => normalizeValue(landschaftItem.name) === normalizeValue(landschaftName)
    )
    if (!match?.url) return null
    return `https://strapi.prod-strapi-fra-01.surmatik.ch${match.url}`
  }

  const getSummaryPrintFill = () => {
    const selectedName = isMultiStepSelection('druckfarbe')
      ? druckfarbeSelections[activeSummaryPreviewIndex] || ''
      : storeDruckfarbe || ''

    return (selectedName ? getDruckfarbeCode(selectedName) : null) || '#ffffff'
  }

  const getSummaryMotifBackground = () => {
    const selectedName = isMultiStepSelection('color')
      ? colorSelections[activeSummaryPreviewIndex] || ''
      : storeColor || ''

    return (selectedName ? getFlatColorCode(selectedName) : null) || '#111111'
  }

  const getSummaryMotifTextColor = () => {
    const backgroundCode = getSummaryMotifBackground()
    if (!backgroundCode.startsWith('#')) return '#ffffff'

    const normalized = backgroundCode.replace('#', '')
    const longHex =
      normalized.length === 3
        ? normalized
            .split('')
            .map((ch) => `${ch}${ch}`)
            .join('')
        : normalized

    const r = parseInt(longHex.slice(0, 2), 16)
    const g = parseInt(longHex.slice(2, 4), 16)
    const b = parseInt(longHex.slice(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.62 ? '#1c2228' : '#ffffff'
  }

  const summaryPrintFill = getSummaryPrintFill()
  const summaryHobbyPrintFill = product.includes('beanie') ? '#111111' : summaryPrintFill
  const summaryMotifBackground = getSummaryMotifBackground()
  const summaryMotifTextColor = getSummaryMotifTextColor()
  const summarySelectedColor = isMultiStepSelection('color')
    ? colorSelections[activeSummaryPreviewIndex] || ''
    : storeColor || ''
  const filzBagBackgroundUrl = normalizeValue(summarySelectedColor).includes('hellgrau')
    ? FILZ_BAG_LIGHT_BACKGROUND_URL
    : normalizeValue(summarySelectedColor).includes('dunkelgrau')
    ? FILZ_BAG_DARK_BACKGROUND_URL
    : FILZ_BACKGROUND_URL
  const summaryHobbyBackgroundStyle = product.includes('beanie')
    ? {
        backgroundImage: `url(${BEANIE_LEATHER_BACKGROUND_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : product.includes('filz-bag')
    ? {
        backgroundImage: `url(${filzBagBackgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : product.includes('schluesselanhaenger')
    ? {
        backgroundImage: `url(${FILZ_BACKGROUND_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: summaryMotifBackground }

  const addSingleOrMultiProperty = (
    properties: Record<string, string>,
    stepName: string,
    propertyName: string,
    singleValue: string
  ) => {
    if (isMultiStepSelection(stepName)) {
      const values = getStepSelections(stepName)
      properties[propertyName] = values.filter(Boolean).join(' / ')

      values.forEach((value, index) => {
        properties[`${propertyName} (${getSelectionLabel(index)})`] = value || ''
      })
      return
    }

    properties[propertyName] = singleValue
  }

  const handleAddToShopifyCart = () => {
    const params = new URLSearchParams()
    params.set('id', config.id) // z. B. 51964063285577
  
    const properties: Record<string, string> = {}
    addSingleOrMultiProperty(properties, 'gender', 'Geschlecht', gender || '')
    addSingleOrMultiProperty(properties, 'size', 'Grösse', storeSize || '')
    addSingleOrMultiProperty(properties, 'color', 'Farbe', storeColor || '')
    addSingleOrMultiProperty(properties, 'druckfarbe', 'Druckfarbe', storeDruckfarbe || '')
    properties.Hobbys = storeHobbys?.join(', ') || ''
    properties.Landschaft = storeLandschaft[0] || ''
    properties.Text = storeNameType === 'Name' ? (storeCustomName || '') : (storeNameType || '')
    properties._KonfigID = `${Date.now()}-${Math.floor(Math.random() * 100000)}`
  
    Object.entries(properties).forEach(([key, value]) => {
      params.set(`properties[${key}]`, value)
    })

    if (typeof window !== 'undefined') {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith(CONFIG_DRAFT_STORAGE_PREFIX))
        .forEach((key) => window.localStorage.removeItem(key))
    }

    storeSyncLockRef.current = true
    clearLocalSelections()
    resetConfigurator()

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
          <h1 className="text-2xl font-bold mb-6 text-[#262626]">
            {isMultiStepSelection('gender') ? 'Wir sind ...' : 'Ich bin ...'}
          </h1>

          {isMultiStepSelection('gender') ? (
            <div className="space-y-6">
              {genderSelections.map((selectedValue, index) => (
                <div key={index} className="space-y-3">
                  <p className="text-sm font-semibold text-[#262626]">{getSelectionLabel(index)}</p>
                  <div className="space-y-3">
                    {config.genderOptions?.map((g) => {
                      const artikel = g.toLowerCase() === 'mann' || g.toLowerCase() === 'kind' ? 'ein' : 'eine'
                      const selected = selectedValue === g

                      return (
                        <button
                          key={`${g}-${index}`}
                          onClick={() => updateStepSelectionAt('gender', index, g)}
                          className={`w-full py-3 rounded-xl border text-[#262626] transition ${
                            selected
                              ? 'bg-black text-white border-black'
                              : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                          }`}
                        >
                          ... {artikel} {g}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <button
                disabled={genderSelections.some((value) => !value)}
                onClick={() => {
                  setStepSelections('gender', genderSelections)
                  if (genderSelections[0] && isGenderValue(genderSelections[0])) {
                    setGender(genderSelections[0])
                  }
                  goToNextStep()
                }}
                className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50"
              >
                Weiter
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {config.genderOptions.map((g) => {
                const artikel = g.toLowerCase() === 'mann' || g.toLowerCase() === 'kind' ? 'ein' : 'eine'
                return (
                  <button
                    key={g}
                    onClick={() => {
                      if (isGenderValue(g)) {
                        setGender(g)
                      }
                      goToNextStep()
                    }}
                    className="w-full py-3 bg-gray-100 rounded-xl hover:bg-gray-200 border border-gray-300 text-[#262626]"
                  >
                    ... {artikel} {g}
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}


      {/* Step: Size */}
      {step === 'size' && config.sizes && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-[#262626]">Meine Grösse</h1>

          {isMultiStepSelection('size') ? (
            <div className="space-y-4 mb-4">
              {sizeSelections.map((selectedValue, index) => (
                <div key={index}>
                  <p className="text-sm font-semibold text-[#262626] mb-2">{getSelectionLabel(index)}</p>
                  <select
                    value={selectedValue}
                    onChange={(e) => updateStepSelectionAt('size', index, e.target.value)}
                    className="w-full p-3 border rounded-xl bg-white text-[#262626]"
                  >
                    {config.sizes?.map((size) => (
                      <option key={`${size}-${index}`} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : (
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
          )}

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
            disabled={
              isMultiStepSelection('size')
                ? sizeSelections.some((value) => !isSizeValueValid(value))
                : !selectedSize || selectedSize === 'Wähle eine Grösse aus'
            }
            onClick={() => {
              if (isMultiStepSelection('size')) {
                setStepSelections('size', sizeSelections)
                if (sizeSelections[0]) {
                  setSize(sizeSelections[0])
                }
                goToNextStep()
                return
              }

              setSize(selectedSize)
              goToNextStep()
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

          {hasImageColorChoices ? (
            isMultiStepSelection('color') ? (
              <div className="space-y-6 mb-6">
                {colorSelections.map((selectedValue, index) => (
                  <div key={index}>
                    <p className="text-sm font-semibold text-[#262626] mb-3">{getSelectionLabel(index)}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {colorOptionsWithImages.map((farbe) => {
                        const selected = selectedValue === farbe.name
                        return (
                          <div
                            key={`${farbe.name}-${index}`}
                            onClick={() => updateStepSelectionAt('color', index, farbe.name)}
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {colorOptionsWithImages.map((farbe) => {
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
            )
          ) : isMultiStepSelection('color') ? (
            <div className="space-y-4 mb-4">
              {colorSelections.map((selectedValue, index) => (
                <div key={index}>
                  <p className="text-sm font-semibold text-[#262626] mb-2">{getSelectionLabel(index)}</p>
                  <select
                    value={selectedValue}
                    onChange={(e) => updateStepSelectionAt('color', index, e.target.value)}
                    className="w-full p-3 border rounded-xl bg-white text-[#262626]"
                  >
                    <option>Wähle deine Farbe aus</option>
                    {config.colors?.map((color) => (
                      <option key={`${color}-${index}`} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : (
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
          )}

          <button
            disabled={
              isMultiStepSelection('color')
                ? colorSelections.some((value) => !isColorValueValid(value))
                : !selectedColor || selectedColor === 'Wähle deine Farbe aus'
            }
            onClick={() => {
              if (isMultiStepSelection('color')) {
                setStepSelections('color', colorSelections)
                if (colorSelections[0]) {
                  setColor(colorSelections[0])
                }
                goToNextStep()
                return
              }

              setColor(selectedColor)
              goToNextStep()
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

          {isMultiStepSelection('druckfarbe') ? (
            <div className="space-y-6 mb-6">
              {druckfarbeSelections.map((selectedValue, index) => (
                <div key={index}>
                  <p className="text-sm font-semibold text-[#262626] mb-3">{getSelectionLabel(index)}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {druckfarben.map((farbe) => {
                      const selected = selectedValue === farbe.name
                      return (
                        <div
                          key={`${farbe.name}-${index}`}
                          onClick={() => updateStepSelectionAt('druckfarbe', index, farbe.name)}
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
                </div>
              ))}
            </div>
          ) : (
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
          )}

          <button
            disabled={
              isMultiStepSelection('druckfarbe')
                ? druckfarbeSelections.some((value) => !value)
                : !selectedDruckfarbe
            }
            onClick={() => {
              if (isMultiStepSelection('druckfarbe')) {
                setStepSelections('druckfarbe', druckfarbeSelections)
                if (druckfarbeSelections[0]) {
                  setDruckfarbe(druckfarbeSelections[0])
                }
                goToNextStep()
                return
              }

              setDruckfarbe(selectedDruckfarbe)
              goToNextStep()
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
        {isSharedStepSelection('hobbys') && (
          <p className="mb-4 rounded-xl bg-gray-100 p-3 text-sm text-[#262626]">
            {getSharedSelectionHintText('hobbys')}
          </p>
        )}

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
        {isSharedStepSelection('landschaft') && (
          <p className="mb-4 rounded-xl bg-gray-100 p-3 text-sm text-[#262626]">
            {getSharedSelectionHintText('landschaft')}
          </p>
        )}

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
        {isSharedStepSelection('text') && (
          <p className="mb-4 rounded-xl bg-gray-100 p-3 text-sm text-[#262626]">
            {getSharedSelectionHintText('text')}
          </p>
        )}
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
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#1c2228]">Deine Auswahl</h1>
            <p className="text-sm text-gray-600 mt-1">
              Fast fertig. Prüfe kurz deine Konfiguration.
            </p>
          </div>
          <span className="rounded-full border border-[#d9e0e7] bg-[#eef3f8] px-3 py-1 text-xs font-semibold text-[#1c2228]">
            Fast fertig
          </span>
        </div>

        <div className="rounded-2xl border border-[#e4e7eb] bg-white p-3 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#1c2228]">
            {hasMultiStepSummaryColumns ? (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: multiSelectionCount }, (_, index) => {
                  const genderValue = isMultiStepSelection('gender')
                    ? genderSelections[index] || ''
                    : gender || ''
                  const sizeValue = isMultiStepSelection('size') ? sizeSelections[index] || '' : storeSize || ''
                  const colorValue = isMultiStepSelection('color')
                    ? colorSelections[index] || ''
                    : storeColor || ''
                  const druckfarbeValue = isMultiStepSelection('druckfarbe')
                    ? druckfarbeSelections[index] || ''
                    : storeDruckfarbe || ''
                  const colorImageUrl = colorValue ? getColorPreviewImageUrl(colorValue) : null
                  const flatColorCode = colorValue ? getFlatColorCode(colorValue) : null
                  const druckfarbeCode = druckfarbeValue ? getDruckfarbeCode(druckfarbeValue) : null

                  return (
                    <div
                      key={`summary-multi-column-${index}`}
                      className="rounded-2xl border border-[#dfe5ec] bg-gradient-to-b from-white to-[#f8fafc] p-4"
                    >
                      <h3 className="text-base font-semibold text-[#1c2228]">
                        {isTshirtProduct ? `T-Shirt ${index + 1}` : getSelectionLabel(index)}
                      </h3>

                      <div className="mt-3 space-y-2">
                        {config.flow.includes('gender') && (
                          <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
                            <span className="text-sm text-gray-500">Geschlecht</span>
                            <span className="font-semibold text-[#1c2228]">{genderValue || '–'}</span>
                          </div>
                        )}

                        {config.flow.includes('size') && (
                          <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
                            <span className="text-sm text-gray-500">Grösse</span>
                            <span className="font-semibold text-[#1c2228]">{sizeValue || '–'}</span>
                          </div>
                        )}

                        {config.flow.includes('color') && (
                          <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
                            <span className="text-sm text-gray-500">Farbe</span>
                            <div className="flex items-center gap-3">
                              {colorValue ? (
                                <>
                                  {colorImageUrl ? (
                                    <Image
                                      src={colorImageUrl}
                                      alt={colorValue}
                                      width={52}
                                      height={52}
                                      className="w-[52px] h-[52px] rounded-md object-contain border border-gray-200 bg-white"
                                    />
                                  ) : flatColorCode ? (
                                    <span
                                      className="w-5 h-5 rounded-full border border-black/10 ring-2 ring-white shadow-sm"
                                      style={{ backgroundColor: flatColorCode }}
                                    />
                                  ) : null}
                                  <span className="font-semibold text-[#1c2228]">{colorValue}</span>
                                </>
                              ) : (
                                <span className="font-semibold text-[#1c2228]">–</span>
                              )}
                            </div>
                          </div>
                        )}

                        {config.flow.includes('druckfarbe') && (
                          <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
                            <span className="text-sm text-gray-500">Druckfarbe</span>
                            <div className="flex items-center gap-2">
                              {druckfarbeValue ? (
                                <>
                                  {druckfarbeCode && (
                                    <span
                                      className="w-5 h-5 rounded-full border border-black/10 ring-2 ring-white shadow-sm"
                                      style={{ backgroundColor: druckfarbeCode }}
                                    />
                                  )}
                                  <span className="font-semibold text-[#1c2228]">{druckfarbeValue}</span>
                                </>
                              ) : (
                                <span className="font-semibold text-[#1c2228]">–</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <>
                {config.flow.includes('gender') && (
                  <div className="rounded-xl border border-[#e6eaef] bg-gradient-to-b from-white to-[#f9fafb] px-3 py-3">
                    <p className="text-sm font-medium text-gray-500">Geschlecht</p>
                    <p className="mt-1 text-base font-semibold">{gender ?? '–'}</p>
                  </div>
                )}

                {config.flow.includes('size') && (
                  <div className="rounded-xl border border-[#e6eaef] bg-gradient-to-b from-white to-[#f9fafb] px-3 py-3">
                    <p className="text-sm font-medium text-gray-500">Grösse</p>
                    <p className="mt-1 text-base font-semibold">{storeSize ?? '–'}</p>
                  </div>
                )}

                {config.flow.includes('color') && (
                  <div className="rounded-xl border border-[#e6eaef] bg-gradient-to-b from-white to-[#f9fafb] px-3 py-3">
                    <p className="text-sm font-medium text-gray-500">Farbe</p>
                    <div className="mt-1 flex items-center gap-3">
                      {storeColor ? (
                        <>
                          {getColorPreviewImageUrl(storeColor) ? (
                            <Image
                              src={getColorPreviewImageUrl(storeColor) as string}
                              alt={storeColor}
                              width={52}
                              height={52}
                              className="w-[52px] h-[52px] rounded-md object-contain border border-gray-200 bg-white"
                            />
                          ) : getFlatColorCode(storeColor) ? (
                            <span
                              className="w-5 h-5 rounded-full border border-black/10 ring-2 ring-white shadow-sm"
                              style={{ backgroundColor: getFlatColorCode(storeColor) as string }}
                            />
                          ) : null}
                          <span className="text-base font-semibold">{storeColor}</span>
                        </>
                      ) : (
                        <span className="text-base font-semibold">–</span>
                      )}
                    </div>
                  </div>
                )}

                {config.flow.includes('druckfarbe') && (
                  <div className="rounded-xl border border-[#e6eaef] bg-gradient-to-b from-white to-[#f9fafb] px-3 py-3">
                    <p className="text-sm font-medium text-gray-500">Druckfarbe</p>
                    <div className="mt-1 flex items-center gap-2">
                      {storeDruckfarbe ? (
                        <>
                          {getDruckfarbeCode(storeDruckfarbe) && (
                            <span
                              className="w-5 h-5 rounded-full border border-black/10 ring-2 ring-white shadow-sm"
                              style={{ backgroundColor: getDruckfarbeCode(storeDruckfarbe) as string }}
                            />
                          )}
                          <span className="text-base font-semibold">{storeDruckfarbe}</span>
                        </>
                      ) : (
                        <span className="text-base font-semibold">–</span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {(config.flow.includes('hobbys') || config.flow.includes('landschaft')) && (
            <div className="mt-6 space-y-4">
              {multiSelectionCount > 1 && hasMultiStepSummaryColumns && (
                <div className="rounded-xl border border-[#e6eaef] bg-[#f8fafc] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-gray-600">
                      Darstellung aktuell in den Farben von{' '}
                      <span className="font-semibold text-[#1c2228]">
                        {getSummaryPreviewLabel(activeSummaryPreviewIndex)}
                      </span>
                    </p>
                    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                      {Array.from({ length: multiSelectionCount }, (_, index) => {
                        const isActive = index === activeSummaryPreviewIndex
                        return (
                          <button
                            key={`summary-preview-switch-${index}`}
                            type="button"
                            onClick={() => setSummaryPreviewIndex(index)}
                            className={`px-3 py-1.5 rounded-md text-sm transition ${
                              isActive
                                ? 'bg-[#1c2228] text-white'
                                : 'text-[#1c2228] hover:bg-gray-100'
                            }`}
                          >
                            {getSummaryPreviewLabel(index)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {config.flow.includes('hobbys') && (
                <div className="rounded-2xl border border-[#e6eaef] bg-[#fcfdff] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-[#1c2228]">Hobbys</strong>
                    <span className="text-xs text-gray-500">{storeHobbys?.length || 0} ausgewählt</span>
                  </div>
                  {storeHobbys?.length ? (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {storeHobbys.map((hobby) => {
                        const hobbyThumbnailUrl = getHobbyThumbnailUrl(hobby)
                        return (
                          <div
                            key={hobby}
                            className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition hover:shadow-md"
                          >
                            <div
                              className="w-full aspect-square flex items-center justify-center rounded-md overflow-hidden px-2"
                              style={summaryHobbyBackgroundStyle}
                            >
                              {hobbyThumbnailUrl ? (
                                <span
                                  className="block w-28 h-28"
                                  style={{
                                    background: summaryHobbyPrintFill,
                                    WebkitMaskImage: `url(${hobbyThumbnailUrl})`,
                                    WebkitMaskRepeat: 'no-repeat',
                                    WebkitMaskPosition: 'center',
                                    WebkitMaskSize: 'contain',
                                    maskImage: `url(${hobbyThumbnailUrl})`,
                                    maskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    maskSize: 'contain',
                                  }}
                                  aria-hidden="true"
                                />
                              ) : (
                                <span className="text-xs text-center" style={{ color: summaryMotifTextColor }}>
                                  {hobby}
                                </span>
                              )}
                            </div>
                            <p className="text-center text-sm text-[#1c2228] mt-2 font-medium">{hobby}</p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">Keine Hobbys ausgewählt.</p>
                  )}
                </div>
              )}

              {config.flow.includes('landschaft') && (
                <div className="rounded-2xl border border-[#e6eaef] bg-[#fcfdff] p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <strong className="text-[#1c2228]">Landschaft</strong>
                    <span className="text-sm text-gray-600">{landschaftValue || '–'}</span>
                  </div>
                  {landschaftPreviewUrl ? (
                    <div className="mt-1 max-w-md">
                      <div
                        className="relative w-full aspect-[16/6] rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                        style={{ background: summaryMotifBackground }}
                      >
                        <span
                          className="absolute inset-0"
                          style={{
                            background: summaryPrintFill,
                            WebkitMaskImage: `url(${landschaftPreviewUrl})`,
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            WebkitMaskSize: 'contain',
                            maskImage: `url(${landschaftPreviewUrl})`,
                            maskMode: 'luminance',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: 'contain',
                          }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Keine Landschaft ausgewählt.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {config.flow.includes('text') && (
            <div className="mt-4 rounded-xl border border-[#e6eaef] bg-gradient-to-b from-white to-[#f9fafb] px-3 py-3">
              <p className="text-sm font-medium text-gray-700">Text unter dem Motiv</p>
              <p className="mt-1 text-base font-semibold text-[#1c2228]">{textValue || '–'}</p>
            </div>
          )}

          <button
            onClick={handleAddToShopifyCart}
            className="w-full mt-6 bg-[#1c2228] text-white py-3 rounded-xl hover:opacity-90 transition shadow-md shadow-[#1c2228]/20"
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
