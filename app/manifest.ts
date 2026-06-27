import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Validexio',
    short_name: 'Validexio',
    description: 'AI-powered startup validation platform. From concept to customer in 60 seconds.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#FDFCF8',
    theme_color: '#FDFCF8',
    icons: [
      {
        src: '/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/app-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
  }
}
