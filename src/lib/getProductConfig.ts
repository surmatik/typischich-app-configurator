import { productConfigs } from '@/data/productConfig'

export function getProductConfigBySlug(slug: string) {
  return productConfigs.find((p) => p.slug === slug)
}

export function getNextStep(slug: string, currentStep: string): string | null {
  const product = getProductConfigBySlug(slug)
  if (!product) return null

  const index = product.flow.indexOf(currentStep)
  if (index === -1 || index === product.flow.length - 1) return null

  return product.flow[index + 1]
}
