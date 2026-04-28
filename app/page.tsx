// app/page.tsx - Root page redirects to marketing home
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/marketing')
}
