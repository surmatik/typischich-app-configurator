'use client'

import { useRouter } from 'next/navigation'

interface Props {
  steps: string[]
  current: string
  productSlug: string
  setDirection?: (dir: number) => void
}

export default function StepNavigator({ steps, current, productSlug, setDirection }: Props) {
  const router = useRouter()
  const currentIndex = steps.indexOf(current)

  return (
    <div className="flex justify-center mt-4">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (setDirection) setDirection(index > currentIndex ? 1 : -1) // ✅ Richtung setzen
                router.push(`/configurator/${productSlug}/${step}`)
              }}
              className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center
                ${index <= currentIndex ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'}`}
            >
              {index + 1}
            </button>
            {index < steps.length - 1 && (
              <div className={`w-8 h-1 ${index < currentIndex ? 'bg-black' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
