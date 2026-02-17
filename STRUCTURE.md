# 📁 Struttura Progetto Vittl

## Route Groups (cartelle con parentesi)

### (marketing) - Pagine Pubbliche

- **URL**: `/`, `/chi-siamo`, `/contatti`, etc.
- **Layout**: Navbar semplice + Footer
- **Auth**: Non richiesta
- **Scopo**: Landing page, marketing, pagine informative

### (auth) - Autenticazione

- **URL**: `/login`, `/signup`
- **Layout**: Centrato, minimal
- **Auth**: Non richiesta (ma redirect se già loggato)
- **Scopo**: Login e registrazione utenti

### (dashboard) - App Protetta

- **URL**: `/dashboard`, `/dashboard/menu`, etc.
- **Layout**: Sidebar + Top bar
- **Auth**: **OBBLIGATORIA** (redirect a /login se non autenticato)
- **Scopo**: Applicazione SaaS vera e propria

## Naming Convention Next.js

- `page.tsx` → Pagina/route
- `layout.tsx` → Layout condiviso
- `loading.tsx` → Loading state
- `error.tsx` → Error boundary
- `route.ts` → API endpoint

## Struttura API

- `app/api/[risorsa]/route.ts` → Endpoint REST
- GET, POST, PUT, DELETE in stesso file
- Autenticazione con Clerk
- Database con Prisma

## Componenti

- `app/components/ui/` → Componenti UI generici (Button, Card, etc.)
- `app/(marketing)/components/` → Solo per landing
- `app/(dashboard)/components/` → Solo per dashboard

```

---

## ✅ RISULTATO FINALE
```

app/
├── (marketing)/ ← Landing e pagine pubbliche
│ ├── components/ ← Componenti landing
│ ├── layout.tsx ← Navbar marketing
│ ├── page.tsx ← Homepage
│ ├── chi-siamo/
│ ├── contatti/
│ └── ...
│
├── (auth)/ ← Login/Signup
│ ├── layout.tsx ← Layout centrato
│ ├── login/page.tsx
│ └── signup/page.tsx
│
├── (dashboard)/ ← App protetta
│ ├── components/ ← Componenti dashboard
│ ├── layout.tsx ← Sidebar + auth check
│ ├── page.tsx ← Overview
│ ├── menu/page.tsx
│ ├── inventario/page.tsx
│ └── ...
│
├── api/ ← Backend
│ ├── auth/
│ ├── menu/route.ts
│ └── ...
│
└── components/ ← Componenti globali
└── ui/
