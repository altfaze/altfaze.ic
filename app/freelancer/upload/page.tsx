'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'

const CATEGORIES = [
  { value: 'template', label: 'Website Template' },
  { value: 'code', label: 'Code Library' },
  { value: 'design', label: 'Design System' },
  { value: 'component', label: 'UI Component' },
  { value: 'plugin', label: 'Plugin' },
  { value: 'other', label: 'Other' },
]

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

interface UploadFormData {
  title: string
  description: string
  category: string
  price: number
  features: string[]
}

export default function UploadProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [templateFile, setTemplateFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    category: 'template',
    price: 0,
    features: [],
  })
  const [featureInput, setFeatureInput] = useState('')

  // File selection handlers
  const handleTemplateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File Too Large',
        description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        variant: 'destructive',
      })
      return
    }

    setTemplateFile(file)
    toast({
      title: 'File Selected',
      description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
    })
  }

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select an image file (JPG, PNG, WebP)',
        variant: 'destructive',
      })
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: 'Image Too Large',
        description: `Maximum image size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
        variant: 'destructive',
      })
      return
    }

    setPreviewImage(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImageUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    toast({
      title: 'Image Selected',
      description: `${file.name} ready for preview`,
    })
  }

  // Feature management
  const handleAddFeature = (feature: string) => {
    if (feature.trim() && !formData.features.includes(feature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, feature.trim()],
      }))
      setFeatureInput('')
    }
  }

  const handleRemoveFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }))
  }

  // Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validation
      if (!formData.title.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter a project title',
          variant: 'destructive',
        })
        return
      }

      if (!formData.description.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter a project description',
          variant: 'destructive',
        })
        return
      }

      if (formData.price <= 0) {
        toast({
          title: 'Error',
          description: 'Please enter a valid price greater than $0',
          variant: 'destructive',
        })
        return
      }

      if (!templateFile) {
        toast({
          title: 'Error',
          description: 'Please select a template file to upload',
          variant: 'destructive',
        })
        return
      }

      try {
        setIsLoading(true)
        setUploadProgress(0)

        // Create FormData for file upload
        const uploadFormData = new FormData()
        uploadFormData.append('title', formData.title)
        uploadFormData.append('description', formData.description)
        uploadFormData.append('category', formData.category)
        uploadFormData.append('price', formData.price.toString())
        uploadFormData.append('features', JSON.stringify(formData.features))
        uploadFormData.append('templateFile', templateFile)

        if (previewImage) {
          uploadFormData.append('previewImage', previewImage)
        }

        // Upload with progress tracking
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100
            setUploadProgress(Math.round(percentComplete))
          }
        })

        // Create promise-based wrapper for XHR
        const response = await new Promise<{
          success: boolean
          data?: { id: string; title: string }
          message?: string
        }>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const result = JSON.parse(xhr.responseText)
                resolve(result)
              } catch (e) {
                reject(new Error('Invalid response from server'))
              }
            } else {
              try {
                const error = JSON.parse(xhr.responseText)
                reject(new Error(error.message || `Upload failed with status ${xhr.status}`))
              } catch {
                reject(new Error(`Upload failed with status ${xhr.status}`))
              }
            }
          }

          xhr.onerror = () => reject(new Error('Network error during upload'))
          xhr.onabort = () => reject(new Error('Upload cancelled'))

          xhr.open('POST', '/api/templates/create', true)
          xhr.send(uploadFormData)
        })

        if (response.success) {
          toast({
            title: 'Success!',
            description: `${formData.title} has been uploaded successfully!`,
          })

          // Reset form
          setFormData({
            title: '',
            description: '',
            category: 'template',
            price: 0,
            features: [],
          })
          setTemplateFile(null)
          setPreviewImage(null)
          setPreviewImageUrl('')
          setUploadProgress(0)

          // Redirect to templates page
          setTimeout(() => {
            router.push('/freelancer/templates')
          }, 1500)
        } else {
          throw new Error(response.message || 'Upload failed')
        }
      } catch (error) {
        toast({
          title: 'Upload Failed',
          description: error instanceof Error ? error.message : 'An error occurred during upload',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
        setUploadProgress(0)
      }
    },
    [formData, templateFile, previewImage, router, toast]
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-4xl">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/freelancer/templates">← Back to Templates</Link>
        </Button>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Upload New Project</CardTitle>
                <CardDescription>
                  Share your template, code, or design with the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="text-sm font-medium block mb-2">Project Title *</label>
                    <Input
                      type="text"
                      placeholder="e.g., Modern SaaS Landing Page Template"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      disabled={isLoading}
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.title.length}/100 characters
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium block mb-2">Description *</label>
                    <Textarea
                      placeholder="Describe your project: features, technology stack, use cases, etc."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      disabled={isLoading}
                      rows={5}
                      maxLength={1000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.description.length}/1000 characters
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium block mb-2">Category *</label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-sm font-medium block mb-2">Price (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="29.99"
                        value={formData.price || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            price: parseFloat(e.target.value) || 0,
                          }))
                        }
                        disabled={isLoading}
                        min="1"
                        max="10000"
                        step="0.01"
                        className="pl-6"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum: $1 • Maximum: $10,000
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="text-sm font-medium block mb-2">Features/Highlights</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        placeholder="e.g., Responsive design, Dark mode"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddFeature(featureInput)
                          }
                        }}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddFeature(featureInput)}
                        disabled={!featureInput.trim() || isLoading}
                        variant="secondary"
                      >
                        Add
                      </Button>
                    </div>

                    {formData.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="gap-2">
                            {feature}
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(feature)}
                              className="hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4">
                    {/* Template File */}
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Template/Project File *
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          hidden
                          onChange={handleTemplateFileChange}
                          disabled={isLoading}
                        />
                        {templateFile ? (
                          <div className="space-y-2">
                            <Icons.upload className="h-8 w-8 mx-auto text-primary" />
                            <div>
                              <p className="font-medium">{templateFile.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(templateFile.size / (1024 * 1024)).toFixed(2)}MB
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setTemplateFile(null)
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Icons.upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Max {MAX_FILE_SIZE / (1024 * 1024)}MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preview Image */}
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Preview Image (Optional)
                      </label>
                      <div
                        onClick={() => imageInputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition"
                      >
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handlePreviewImageChange}
                          disabled={isLoading}
                        />
                        {previewImageUrl ? (
                          <div className="space-y-2">
                            <div className="relative h-32 w-full">
                              <Image
                                src={previewImageUrl}
                                alt="Preview"
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            {previewImage && (
                              <p className="text-sm text-muted-foreground">{previewImage.name}</p>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewImage(null)
                                setPreviewImageUrl('')
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Icons.image className="h-8 w-8 mx-auto text-muted-foreground" />
                            <div>
                              <p className="font-medium">Click to upload preview image</p>
                              <p className="text-sm text-muted-foreground">
                                JPG, PNG, WebP • Max {MAX_IMAGE_SIZE / (1024 * 1024)}MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span className="font-medium">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !templateFile}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Icons.upload className="mr-2 h-4 w-4" />
                        Publish Project
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Guidelines & Tips */}
          <div className="space-y-4">
            {/* Summary Card */}
            {(formData.title || formData.price > 0) && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {formData.title && (
                    <div>
                      <p className="text-muted-foreground">Title</p>
                      <p className="font-medium truncate">{formData.title}</p>
                    </div>
                  )}
                  {formData.price > 0 && (
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium text-lg text-primary">${formData.price.toFixed(2)}</p>
                    </div>
                  )}
                  {formData.category && (
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <Badge variant="secondary">
                        {CATEGORIES.find((c) => c.value === formData.category)?.label}
                      </Badge>
                    </div>
                  )}
                  {formData.features.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-1">Features</p>
                      <p className="text-sm">{formData.features.length} features added</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium flex items-center gap-2 mb-1">
                    <Icons.check className="h-4 w-4 text-green-600" />
                    Do&apos;s
                  </p>
                  <ul className="space-y-1 text-muted-foreground ml-6 list-disc">
                    <li>Use clear, descriptive titles</li>
                    <li>Include detailed descriptions</li>
                    <li>Add preview images</li>
                    <li>Test your files before uploading</li>
                    <li>Include usage instructions</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium flex items-center gap-2 mb-1">
                    <span className="h-4 w-4 text-destructive">✕</span>
                    Don&apos;ts
                  </p>
                  <ul className="space-y-1 text-muted-foreground ml-6 list-disc">
                    <li>Upload copyrighted content</li>
                    <li>Include malware or viruses</li>
                    <li>Use misleading descriptions</li>
                    <li>Upload corrupted files</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* File Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>File Size</span>
                  <Badge variant="outline">Max {MAX_FILE_SIZE / (1024 * 1024)}MB</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Image Size</span>
                  <Badge variant="outline">Max {MAX_IMAGE_SIZE / (1024 * 1024)}MB</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Price Range</span>
                  <Badge variant="outline">$1 - $10k</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
