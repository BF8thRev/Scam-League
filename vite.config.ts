import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Expose both VITE_ and NEXT_PUBLIC_ vars to the browser bundle
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  optimizeDeps: {
    // ExcelJS uses Node streams internally; pre-bundle so Vite resolves them correctly
    include: ['exceljs'],
  },
})
