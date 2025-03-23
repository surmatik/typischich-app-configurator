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
    <div className="w-full overflow-x-auto mt-4 px-4 hide-scrollbar">
      <div className="flex items-center gap-2 justify-start md:justify-center w-max md:w-full">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (setDirection) setDirection(index > currentIndex ? 1 : -1)
                router.push(`/configurator/${productSlug}/${step}`)
              }}
              className={`min-w-8 min-h-8 w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition
                ${index <= currentIndex ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'}`}
            >
              {index + 1}
            </button>
            {index < steps.length - 1 && (
              <div className={`h-1 ${index < currentIndex ? 'bg-black' : 'bg-gray-300'}`} style={{ width: 24 }} />
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  )
}
