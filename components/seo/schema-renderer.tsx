// components/seo/schema-renderer.tsx
// Client-side component for rendering JSON-LD schemas
'use client'

interface SchemaRendererProps {
  schema: Record<string, any>
  id?: string
}

export function SchemaRenderer({ schema, id }: SchemaRendererProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  )
}

// Multiple schemas renderer
interface MultiSchemaRendererProps {
  schemas: Array<{
    schema: Record<string, any>
    id?: string
  }>
}

export function MultiSchemaRenderer({ schemas }: MultiSchemaRendererProps) {
  return (
    <>
      {schemas.map((item, index) => (
        <SchemaRenderer
          key={item.id || index}
          schema={item.schema}
          id={item.id}
        />
      ))}
    </>
  )
}
