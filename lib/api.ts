import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message)
  }
}

export const errorResponse = (status: number, message: string, code: string = 'ERROR') => {
  return NextResponse.json(
    { success: false, error: message, code },
    { status }
  )
}

export const successResponse = <T>(data: T, status: number = 200, message?: string) => {
  return NextResponse.json(
    { success: true, data, message },
    { status }
  )
}

export const validateRequiredFields = (body: any, fields: string[]): string[] => {
  const missing: string[] = []
  for (const field of fields) {
    if (!body[field]) {
      missing.push(field)
    }
  }
  return missing
}

export const formatCurrency = (value: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(value)
}

export class ValidationError extends ApiError {
  constructor(message: string, code: string = 'VALIDATION_ERROR') {
    super(message, 400, code)
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found', code: string = 'NOT_FOUND') {
    super(message, 404, code)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    super(message, 401, code)
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource already exists', code: string = 'CONFLICT') {
    super(message, 409, code)
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad request', code: string = 'BAD_REQUEST') {
    super(message, 400, code)
  }
}
