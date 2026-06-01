import type { MetadataRoute } from 'next';

// PWA manifest — permite instalar la app en la pantalla de inicio del celular
// (Android: banner "Instalar"; iOS: "Añadir a pantalla de inicio").
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RÜVEL Piano Method',
    short_name: 'RÜVEL',
    description: 'Tu portal de piano — clases, canciones, juegos, teoría y más.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
