import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware se pokreće PRE svake stranice.
 *
 * Logika:
 * 1. Osvežava Supabase session token ako ističe
 * 2. Proverava da li korisnik sme da vidi traženu stranicu
 * 3. Redirectuje ako ne sme
 *
 * Zaštićene rute: /dashboard/*
 * Javne rute: /auth/login, /auth/callback, /auth/onboarding
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Kreiramo Supabase klijent koji može da čita i piše kolačiće
  // direktno iz/u Next.js request/response objekta
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Važno: token refresh mora biti upisan i u request i response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Dohvatamo trenutnog korisnika
  // VAŽNO: getUser() verifikuje token sa Supabase serverom
  // getSession() samo čita lokalni kolačić – nije pouzdano za auth
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Zaštita /dashboard ruta ───────────────────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      // Nije ulogovan → login stranica
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Proveravamo da li korisnik ima organizaciju
    // Pozivamo naš backend koji čita iz organization_members tabele
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/organizations/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      // Nema organizacije → onboarding
      if (!data?.data) {
        return NextResponse.redirect(new URL('/auth/onboarding', request.url))
      }
    } catch {
      // Ako backend nije dostupan, ne blokiramo korisnika
      // U produkciji ovo bi trebalo logirati
    }
  }

  // ── Redirect ulogovanog korisnika sa login stranice ───────────────────────
  // Ako je već ulogovan i ide na /auth/login, šaljemo ga na dashboard
  if (pathname === '/auth/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ── Zaštita onboarding stranice ───────────────────────────────────────────
  // Onboarding zahteva da korisnik bude ulogovan
  if (pathname === '/auth/onboarding' && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}

/**
 * Koje rute middleware presreće.
 * Isključujemo statičke fajlove i Next.js internale
 * jer za njih nema smisla proveravati auth.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}