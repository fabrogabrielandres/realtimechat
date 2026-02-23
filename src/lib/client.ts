import { App } from "@/app/api/[[...slugs]]/route"
import { treaty } from "@elysiajs/eden"

// Determinar la URL base según el entorno
const getBaseUrl = () => {
  // En el navegador
  if (typeof window !== 'undefined') {
    // En producción (Vercel) usamos la misma URL
    // En desarrollo local usamos localhost
    return window.location.origin
  }
  // En SSR o server-side
  return process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
}

export const client = treaty<App>(getBaseUrl()).api