/**
 * File Upload Service
 * Handles file uploads to Cloudinary/AWS S3
 */

import axios from 'axios'

export interface UploadResponse {
  success: boolean
  url: string
  publicId?: string
  size?: number
  uploadedAt: string
}

export interface UploadOptions {
  folder?: string
  resource_type?: 'auto' | 'image' | 'video' | 'raw'
  tags?: string[]
}

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResponse> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '')
    formData.append('folder', options.folder || 'altfaze')
    formData.append('resource_type', options.resource_type || 'auto')

    if (options.tags?.length) {
      formData.append('tags', options.tags.join(','))
    }

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      }
    )

    return {
      success: true,
      url: response.data.secure_url,
      publicId: response.data.public_id,
      size: response.data.bytes,
      uploadedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[CLOUDINARY_UPLOAD_ERROR]', error)
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options: { maxSize?: number; allowedTypes?: string[] } = {}
): { valid: boolean; error?: string } {
  const maxSize = options.maxSize || 50 * 1024 * 1024 // 50MB default
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4']

  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not allowed: ${file.type}` }
  }

  return { valid: true }
}

/**
 * Generate secure download token for template
 */
export function generateDownloadToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validate download token
 */
export function isValidDownloadToken(token: string): boolean {
  // Token format: timestamp-random
  const [timestamp] = token.split('-')
  const tokenAge = Date.now() - parseInt(timestamp)
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
  return tokenAge < maxAge
}
