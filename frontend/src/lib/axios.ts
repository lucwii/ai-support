import axios from 'axios'
import { createClient } from './supabase/client'

/**
 * Centralni HTTP klijent za komunikaciju sa NestJS backendom.
 *
 * Umesto da u svakoj komponenti pišemo:
 *   fetch('http://localhost:3001/tickets', {
 *     headers: { Authorization: `Bearer ${token}` }
 *   })
 *
 * Mi samo pišemo:
 *   apiClient.get('/tickets')
 *
 * ...i token se automatski dodaje.
 */

// ── Korak 1: Kreiramo axios instancu sa default podešavanjima ──────────────
const apiClient = axios.create({
  // Sve rute su relativne na ovaj URL
  // /tickets → http://localhost:3001/tickets
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  headers: {
    'Content-Type': 'application/json',
  },

  // 30 sekundi timeout
  // AI pipeline traje 3-8s, standardni 5s timeout bi pucao
  timeout: 30_000,
})

// ── Korak 2: Request interceptor ──────────────────────────────────────────
// Pokreće se automatski PRE svakog API poziva.
// Uzima Supabase token i dodaje ga u header.
//
// Bez ovoga svaki request bi dobio 401 Unauthorized od backenda
// jer AuthGuard zahteva token u Authorization headeru.
apiClient.interceptors.request.use(async (config) => {
  // Kreiramo Supabase browser klijent
  const supabase = createClient()

  // Uzimamo trenutnu sesiju – sadrži JWT access token
  const { data: { session } } = await supabase.auth.getSession()

  if (session?.access_token) {
    // Dodajemo token u svaki request automatski
    // Backend AuthGuard čita upravo ovaj header
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})

// ── Korak 3: Response interceptor ─────────────────────────────────────────
// Pokreće se automatski POSLE svakog API poziva.
// Hvata greške centralno – ne moramo u svakoj komponenti.
apiClient.interceptors.response.use(
  // Uspešan response – samo ga prosleđujemo dalje
  (response) => response,

  // Greška – proveravamo status kod
  async (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Token je istekao ili je neispravan
      // Šaljemo korisnika na login
      window.location.href = '/auth/login'
    }

    // Sve ostale greške (404, 500...) bacamo dalje
    // Komponente ih hvataju u try/catch bloku
    return Promise.reject(error)
  }
)

export default apiClient