import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

/**
 * Safe decimal converter - handles Prisma Decimal objects
 * Converts to number to prevent "toFixed is not a function" errors
 */
export function toSafeNumber(value: unknown): number {
  if (typeof value === "number") return value
  if (value === null || value === undefined) return 0
  
  // Handle Prisma Decimal objects (has toNumber method)
  if (typeof value === "object" && "toNumber" in value) {
    return (value as any).toNumber()
  }
  
  // Fallback to Number conversion
  const parsed = Number(value)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Format amount for display with proper decimal places
 * Usage: formatAmount(amount, 2) => "1234.56"
 */
export function formatAmount(value: unknown, decimals = 2): string {
  const num = toSafeNumber(value)
  return num.toFixed(decimals)
}

/**
 * Convert all Decimal fields in an object to numbers
 * Usage: convertDecimalFields(obj, ['amount', 'price', 'hourlyRate'])
 */
export function convertDecimalFields<T extends Record<string, any>>(
  obj: T,
  fieldNames: (keyof T)[]
): T {
  const result = { ...obj }
  for (const field of fieldNames) {
    if (field in result && result[field] !== null && result[field] !== undefined) {
      result[field] = toSafeNumber(result[field]) as any
    }
  }
  return result
}

/**
 * Convert nested object's Decimal fields to numbers
 * Handles objects with nested relationships
 */
export function convertDecimalFieldsDeep(obj: any, decimalFields: string[]): any {
  if (!obj || typeof obj !== "object") return obj
  
  const result = { ...obj }
  
  for (const field of decimalFields) {
    if (field in result) {
      result[field] = toSafeNumber(result[field])
    }
  }
  
  // Recursively handle nested objects
  for (const key in result) {
    if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
      result[key] = convertDecimalFieldsDeep(result[key], decimalFields)
    } else if (Array.isArray(result[key])) {
      result[key] = result[key].map((item: any) =>
        convertDecimalFieldsDeep(item, decimalFields)
      )
    }
  }
  
  return result
}