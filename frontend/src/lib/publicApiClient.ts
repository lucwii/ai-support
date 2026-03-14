import axios from 'axios'

/**
 * HTTP klijent za javne (unauthenticated) API pozive.
 * Nema auth interceptor — koristi se za public ticket endpointe.
 */
const publicApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

export default publicApiClient
