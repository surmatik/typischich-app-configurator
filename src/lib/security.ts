const STRAPI_ORIGIN = 'https://strapi.prod-strapi-fra-01.surmatik.ch'
const SHOPIFY_CART_ADD_URL = 'https://typischich.ch/cart/add'

const MAX_CART_PROPERTY_LENGTH = 200
const MAX_CUSTOM_NAME_LENGTH = 80

/** Accept only Strapi /uploads paths (relative or absolute to our CMS origin). */
export function resolveStrapiMediaUrl(
  path: string | null | undefined
): string | null {
  if (!path || typeof path !== 'string') return null

  const trimmed = path.trim()
  if (!trimmed || trimmed.includes('..') || trimmed.includes('\\')) return null

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed)
      if (url.origin !== STRAPI_ORIGIN) return null
      if (!url.pathname.startsWith('/uploads/')) return null
      return `${url.origin}${url.pathname}${url.search}`
    } catch {
      return null
    }
  }

  if (!trimmed.startsWith('/uploads/')) return null
  return `${STRAPI_ORIGIN}${trimmed}`
}

export function sanitizeCartProperty(
  value: string,
  maxLength = MAX_CART_PROPERTY_LENGTH
): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength)
}

export function isAllowedOption(
  value: string | null | undefined,
  allowed: string[] | undefined
): boolean {
  if (!value) return true
  if (!allowed || allowed.length === 0) return true
  const normalized = value.trim().toLowerCase()
  return allowed.some((option) => option.trim().toLowerCase() === normalized)
}

export function validateCartSelections(input: {
  gender: string | null
  size: string | null
  color: string | null
  genderOptions?: string[]
  sizes?: string[]
  colors?: string[]
  customName?: string
  multiValues?: {
    gender?: string[]
    size?: string[]
    color?: string[]
  }
}): { ok: true } | { ok: false; reason: string } {
  const checkList = (
    values: string[] | undefined,
    allowed: string[] | undefined,
    reason: string
  ) => {
    if (!values) return null
    for (const value of values) {
      if (value && !isAllowedOption(value, allowed)) {
        return reason
      }
    }
    return null
  }

  if (!isAllowedOption(input.gender, input.genderOptions)) {
    return { ok: false, reason: 'Ungültiges Geschlecht.' }
  }
  if (!isAllowedOption(input.size, input.sizes)) {
    return { ok: false, reason: 'Ungültige Grösse.' }
  }
  if (!isAllowedOption(input.color, input.colors)) {
    return { ok: false, reason: 'Ungültige Farbe.' }
  }

  const multiGenderError = checkList(
    input.multiValues?.gender,
    input.genderOptions,
    'Ungültiges Geschlecht.'
  )
  if (multiGenderError) return { ok: false, reason: multiGenderError }

  const multiSizeError = checkList(
    input.multiValues?.size,
    input.sizes,
    'Ungültige Grösse.'
  )
  if (multiSizeError) return { ok: false, reason: multiSizeError }

  const multiColorError = checkList(
    input.multiValues?.color,
    input.colors,
    'Ungültige Farbe.'
  )
  if (multiColorError) return { ok: false, reason: multiColorError }

  if (
    input.customName &&
    input.customName.trim().length > MAX_CUSTOM_NAME_LENGTH
  ) {
    return { ok: false, reason: 'Name ist zu lang.' }
  }
  return { ok: true }
}

/**
 * Top-level POST to Shopify /cart/add avoids state-changing GET URLs
 * (CSRF via crafted links / prefetch) while preserving a full navigation.
 */
export function postToShopifyCart(
  variantId: string,
  properties: Record<string, string>
): void {
  if (typeof document === 'undefined') return

  const form = document.createElement('form')
  form.method = 'POST'
  form.action = SHOPIFY_CART_ADD_URL
  form.acceptCharset = 'UTF-8'
  form.style.display = 'none'

  const fields: Record<string, string> = {
    id: sanitizeCartProperty(variantId, 64),
    quantity: '1',
  }

  Object.entries(properties).forEach(([key, value]) => {
    fields[`properties[${sanitizeCartProperty(key, 64)}]`] =
      sanitizeCartProperty(value)
  })

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}
