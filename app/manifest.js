export default function manifest() {
  return {
    name: 'OGGEL digital — Web design studio',
    short_name: 'OGGEL digital',
    description: 'A one-person web design and digital solutions studio based in Amsterdam.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F4EF',
    theme_color: '#0E0E0C',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}
