/**
 * Project validation schemas
 */

export const PROJECT_CATEGORIES = [
  'Web Development',
  'Mobile App',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Data Analysis',
  'Digital Marketing',
  'Video Production',
  'Other',
]

export function isValidProjectCategory(category: string): boolean {
  return PROJECT_CATEGORIES.includes(category)
}

export interface CreateProjectInput {
  title: string
  description: string
  budget: number
  category: string
  deadline?: Date
}

export function validateCreateProject(data: unknown): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  const input = data as any

  // Validate title
  if (!input.title || typeof input.title !== 'string') {
    errors.title = 'Title is required'
  } else if (input.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters'
  } else if (input.title.trim().length > 200) {
    errors.title = 'Title must be less than 200 characters'
  }

  // Validate description
  if (!input.description || typeof input.description !== 'string') {
    errors.description = 'Description is required'
  } else if (input.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters'
  } else if (input.description.trim().length > 5000) {
    errors.description = 'Description must be less than 5000 characters'
  }

  // Validate budget
  const budget = parseFloat(input.budget)
  if (isNaN(budget) || budget < 1) {
    errors.budget = 'Budget must be at least $1'
  } else if (budget > 999999999) {
    errors.budget = 'Budget exceeds maximum limit'
  }

  // Validate category
  if (!input.category || !isValidProjectCategory(input.category)) {
    errors.category = `Invalid category. Must be one of: ${PROJECT_CATEGORIES.join(', ')}`
  }

  // Validate deadline (if provided)
  if (input.deadline) {
    const deadline = new Date(input.deadline)
    if (isNaN(deadline.getTime())) {
      errors.deadline = 'Invalid deadline date'
    } else if (deadline < new Date()) {
      errors.deadline = 'Deadline must be in the future'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
