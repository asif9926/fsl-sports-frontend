import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // 🔥 এই লাইনটি Dev Mode-এ PWA টেস্ট করার জন্য 
      devOptions: { enabled: true }, 
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'FSL-SPORTS V2.0',
        short_name: 'FSL-SPORTS',
        description: 'Ultimate Sports Fan Experience',
        theme_color: '#050811',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['@imgly/background-removal', 'onnxruntime-web']
  }
})