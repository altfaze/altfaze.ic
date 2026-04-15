/**
 * Template validation schemas
 */

export const TEMPLATE_CATEGORIES = [
  'Website',
  'E-commerce',
  'Mobile App',
  'Design System',
  'Dashboard',
  'Landing Page',
  'Portfolio',
  'SaaS',
  'Other',
]

export function isValidTemplateCategory(category: string): boolean {
  return TEMPLATE_CATEGORIES.includes(category)
}

export interface CreateTemplateInput {
  title: string
  description: string
  category: string
  price: number
  features: string[]
}

export function validateCreateTemplate(data: unknown): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  const input = data as any

  // Validate title
  if (!input.title || typeof input.title !== 'string') {
    errors.title = 'Title is required'
  } else if (input.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters'
  } else if (input.title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters'
  }

  // Validate description
  if (!input.description || typeof input.description !== 'string') {
    errors.description = 'Description is required'
  } else if (input.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters'
  } else if (input.description.trim().length > 2000) {
    errors.description = 'Description must be less than 2000 characters'
  }

  // Validate category
  if (!input.category || !isValidTemplateCategory(input.category)) {
    errors.category = `Invalid category. Must be one of: ${TEMPLATE_CATEGORIES.join(', ')}`
  }

  // Validate price
  const price = parseFloat(input.price)
  if (isNaN(price) || price < 1) {
    errors.price = 'Price must be at least $1'
  } else if (price > 99999) {
    errors.price = 'Price exceeds maximum limit'
  }

  // Validate features
  if (!Array.isArray(input.features) || input.features.length === 0) {
    errors.features = 'At least one feature is required'
  } else if (input.features.length > 20) {
    errors.features = 'Maximum 20 features allowed'
  } else {
    for (const feature of input.features) {
      if (typeof feature !== 'string' || feature.trim().length === 0) {
        errors.features = 'All features must be non-empty strings'
        break
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
