import StepNavigator from './StepNavigator'
import Image from 'next/image'


interface Props {
    children: React.ReactNode
    step: string
    productSlug: string
    steps: string[]
    title?: string
    setDirection?: (dir: number) => void // ✅ hinzufügen
  }
  
  export default function StepWrapper({ children, step, productSlug, steps, title, setDirection }: Props) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col justify-between">
        {/* Logo */}
        <div className="flex justify-center pt-8">
          <Image
            src="https://typischich.ch/cdn/shop/files/logo_black.png?v=1740907843&width=140"
            alt="Typisch Ich Logo"
            width={140}
            height={140}
            className="h-20 w-auto"
          />
        </div>
  
        {/* Navigation */}
        <StepNavigator steps={steps} current={step} productSlug={productSlug} setDirection={setDirection} /> {/* ✅ */}
  
        {/* Titel */}
        {title && (
          <div className="text-center text-xl font-semibold text-[#262626] mt-6">
            {title}
          </div>
        )}
  
        {/* Inhalt */}
        <div className="flex-1 flex justify-center px-4 mt-4 mb-10">
          <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-10">
            {children}
          </div>
        </div>
  
        {/* Footer */}
        <div className="text-sm text-gray-500 text-center py-6">
          <a href="https://typischich.ch/pages/kontakt" className="mx-2">Kontakt</a>
          <a href="https://typischich.ch/policies/legal-notice" className="mx-2">Impressum</a>
          <a href="https://typischich.ch/policies/privacy-policy" className="mx-2">Datenschutz</a>
        </div>
      </div>
    )
  }
  