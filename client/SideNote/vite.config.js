import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest:{
    "name": "SideNote",
    "short_name": "SideNote",
    "description": "SideNote - Think & Discuss",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#09090b",
    "theme_color": "#09090b",
    icons: [
  { src: "/icons/sideNote-192.png", sizes: "192x192", type: "image/png" },
  { src: "/icons/sideNote-512.png", sizes: "512x512", type: "image/png" },
  { src: "/icons/sideNote-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    },
    })
  ],
})
