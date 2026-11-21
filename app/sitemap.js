import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default async function sitemap() {
  const baseUrl = 'https://nutriwellorganics.com'

  // Static routes
  const routes = [
    '',
    '/shop',
    '/auth',
    '/account',
    '/checkout'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Dynamic Product routes from Firestore
  try {
    const snap = await getDocs(
      query(collection(db, 'products'), where('isActive', '==', true))
    )
    const productRoutes = snap.docs.map((doc) => {
      const data = doc.data()
      return {
        url: `${baseUrl}/product/${data.slug}`,
        lastModified: data.updatedAt?.seconds
          ? new Date(data.updatedAt.seconds * 1000).toISOString()
          : new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }
    })

    return [...routes, ...productRoutes]
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error)
    return routes
  }
}