<div align="center">

# SupportAI

**AI-powered customer support ticketing system**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai)](https://openai.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## O projektu

**SupportAI** je platforma za upravljanje korisnickom podrskom koja kombinuje klasican ticketing sistem sa vestackom inteligencijom. Cilj projekta je da kompanijama omoguci automatizovano odgovaranje na cesta pitanja korisnika, dok agenti podrske mogu da se fokusiraju na slozenije upite.

### Sta aplikacija radi?

- Korisnici mogu da prijave problem ili pitanje putem **formulara za podrsku** (moze biti ugraden na bilo koji sajt)
- Sistem automatski pokusava da **odgovori na tiket koristeci AI** na osnovu baze znanja koju je tim uneo
- Agenti dobijaju **inbox** u kome vide sve tikete, mogu ih dodeljivati kolegama i pratiti statusе
- Tim moze da upravljа **bazom znanja** — unosom clanaka i odgovora koje AI koristi
- Dostupan je **dashboard** sa statistikama i pregledom aktivnosti
- Podrska za vise organizacija sa izolovanim podacima po timu

---

## Screenshotovi

> Dodaj screenshotove aplikacije ovde

| Landing stranica | Dashboard |
|:---:|:---:|
| _screenshot_ | _screenshot_ |

| Inbox | Pregled tiketa |
|:---:|:---:|
| _screenshot_ | _screenshot_ |

| Baza znanja | Podesavanja |
|:---:|:---:|
| _screenshot_ | _screenshot_ |

---

## Tehnologije

### Backend
| Tehnologija | Verzija | Uloga |
|---|---|---|
| NestJS | 11 | REST API framework |
| TypeScript | 5 | Programski jezik |
| Supabase | 2 | PostgreSQL baza i autentikacija |
| OpenAI SDK | 6 | GPT-4o-mini i embeddings |
| Resend | 6 | Transakcioni email servis |

### Frontend
| Tehnologija | Verzija | Uloga |
|---|---|---|
| Next.js | 16 | React framework (App Router) |
| React | 19 | UI biblioteka |
| Tailwind CSS | 4 | Stilizovanje |
| shadcn/ui | latest | Komponente bazirane na Radix UI |
| Recharts | 3 | Grafici i statistike |
| Motion | 12 | Animacije |

### Testiranje
| Alat | Uloga |
|---|---|
| Selenium + NUnit (C#/.NET 10) | End-to-end UI testovi |
| Jest | Unit testovi za backend |
| Postman | API testovi |

---

## Preduslovi

Pre pokretanja projekta, potrebno je imati instalirano:

- [Node.js](https://nodejs.org/) v20 ili noviji
- [npm](https://www.npmjs.com/) (dolazi uz Node.js)
- [.NET SDK](https://dotnet.microsoft.com/download) v10 — samo za pokretanje Selenium testova

Takodje su potrebni sledeci eksterni servisi:

- **Supabase** nalog i projekat — [supabase.com](https://supabase.com)
- **OpenAI** API kljuc — [platform.openai.com](https://platform.openai.com)
- **Resend** API kljuc (za emailove) — [resend.com](https://resend.com)

---

## Instalacija i pokretanje

### 1. Kloniranje repozitorijuma

```bash
git clone https://github.com/<tvoj-username>/ai-support.git
cd ai-support
```

### 2. Instalacija root zavisnosti

```bash
npm install
```

### 3. Podesavanje environment varijabli

#### Backend

Napravi fajl `backend/.env` i popuni ga:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000

# Supabase
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4o-mini

# Email (Resend)
RESEND_API_KEY=re_...
FROM_EMAIL=SupportAI <support@tvoj-domen.com>

# Placanja - Lemon Squeezy (opciono)
LEMON_SQUEEZY_API_KEY=
LEMON_SQUEEZY_STORE_ID=
LEMON_SQUEEZY_WEBHOOK_SECRET=
```

#### Frontend

Napravi fajl `frontend/.env.local` i popuni ga:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Instalacija zavisnosti

```bash
# Backend zavisnosti
cd backend && npm install && cd ..

# Frontend zavisnosti
cd frontend && npm install && cd ..
```

### 5. Pokretanje u razvojnom modu

#### Oba servisa istovremeno (preporuceno)

Iz root direktorijuma:

```bash
npm run dev
```

Ovo pokrece backend i frontend paralelno pomocu `concurrently`.

#### Odvojeno pokretanje

```bash
# Terminal 1 — backend (port 3001)
cd backend
npm run dev

# Terminal 2 — frontend (port 3000)
cd frontend
npm run dev
```

Aplikacija je dostupna na:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## Produkcijsko pokretanje

### Build

```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

### Pokretanje

```bash
# Pokretanje backend-a
cd backend && npm run start:prod

# Pokretanje frontend-a
cd frontend && npm start
```

---

## Testiranje

### Unit testovi (Jest — backend)

```bash
cd backend

# Pokreni testove
npm run test

# Watch mod
npm run test:watch

# Coverage izvestaj
npm run test:cov
```

### End-to-end testovi (Selenium — C#)

Testovi pokrivaju sledece scenarije:
- Login i registracija
- Dashboard pregled
- Pretraga inbox-a
- Dodela tiketa agentima
- Beleske na tiketima

```bash
cd automated-tests
dotnet test
```

> **Napomena:** Pre pokretanja Selenium testova, aplikacija mora biti pokrenuta lokalno.

### API testovi (Postman)

U `postman/` direktorijumu se nalaze kolekcije za testiranje API endpointa:

- `ai-support.postman_collection.json` — Kompletni API testovi
- `SupportAI_GoogleAuth_TicketFlow.postman_collection.json` — Auth i ticket flow
- `SupportAI_Notes.postman_collection.json` — Notes endpoint testovi

Importuj kolekcije u Postman i podesi `base_url` promenljivu na `http://localhost:3001`.

---

## Struktura projekta

```
ai-support/
├── backend/                    # NestJS REST API
│   └── src/
│       ├── ai/                 # OpenAI integracija
│       ├── ai-answer/          # Generisanje AI odgovora
│       ├── auth/               # JWT autentikacija
│       ├── tickets/            # CRUD operacije nad tiketima
│       ├── knowledge/          # Upravljanje bazom znanja
│       ├── organizations/      # Podrska za vise organizacija
│       ├── notes/              # Beleske na tiketima
│       ├── profile/            # Korisnicki profili
│       ├── widget/             # Embeddable widget
│       ├── email/              # Email notifikacije
│       └── payments/           # Integracija sa Lemon Squeezy
│
├── frontend/                   # Next.js aplikacija
│   └── src/
│       ├── app/                # Next.js App Router stranice
│       │   ├── auth/           # Login, registracija, reset lozinke
│       │   ├── dashboard/      # Dashboard, inbox, podesavanja
│       │   ├── submit/         # Javni formular za tiket
│       │   └── ticket/         # Prikaz pojedinacnog tiketa
│       ├── components/         # React komponente
│       ├── hooks/              # Custom React hooks
│       └── lib/                # API klijenti i helperi
│
├── automated-tests/            # C# Selenium testovi
│   └── automated-tests/
│       ├── Tests/              # Test klase
│       └── Pages/              # Page Object Model klase
│
├── postman/                    # Postman kolekcije
├── .github/workflows/          # GitHub Actions CI/CD pipeline
└── package.json                # Root monorepo konfiguracija
```

---

## CI/CD

Projekat koristi **GitHub Actions** za automatizovanu verifikaciju koda.

Pipeline se aktivira na svaki push i pull request ka `main` grani:

1. **Build backend** — Kompajlira NestJS aplikaciju
2. **Build frontend** — Pravi Next.js produkcijski build
3. **Selenium testovi** — Pokrece E2E testove u browser okruzenju

---

## Dostupni skriptovi

### Root

| Komanda | Opis |
|---|---|
| `npm run dev` | Pokrece backend i frontend istovremeno |

### Backend (`cd backend`)

| Komanda | Opis |
|---|---|
| `npm run dev` | Razvojni server sa hot-reload |
| `npm run build` | Kompajlira TypeScript |
| `npm run start:prod` | Produkcijsko pokretanje |
| `npm run test` | Pokrece Jest testove |
| `npm run test:cov` | Testovi sa coverage izvestajem |
| `npm run lint` | ESLint provera i auto-fix |

### Frontend (`cd frontend`)

| Komanda | Opis |
|---|---|
| `npm run dev` | Razvojni server na portu 3000 |
| `npm run build` | Produkcijski build |
| `npm start` | Pokrece produkcijski build |
| `npm run lint` | ESLint provera |

---

## Licenca

Ovaj projekat je licenciran pod [MIT licencom](LICENSE).
