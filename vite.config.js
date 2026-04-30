import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true }, 
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      // ✅ নিচের এই অংশটুকু যোগ করা হয়েছে বড় ফাইল সাপোর্ট করার জন্য
      workbox: {
        maximumFileSizeToCacheInBytes: 30000000, // ৩০ মেগাবাইট পর্যন্ত ফাইল ক্যাশ করবে
      },
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