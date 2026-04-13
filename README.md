# USOB Bareggio — Web App

App ufficiale della squadra di calcio USOB Bareggio.
Stack: **Next.js 14 + Supabase + Vercel**

---

## ✅ Struttura del progetto

```
usob-app/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Home
│   │   ├── calendario/
│   │   │   ├── page.tsx          ← Lista partite
│   │   │   └── [id]/page.tsx     ← Dettaglio partita
│   │   ├── analytics/page.tsx    ← Marcatori, classifica, presenze
│   │   ├── fun/page.tsx          ← Lista paste
│   │   └── admin/page.tsx        ← Area riservata (con password)
│   ├── components/
│   │   ├── BottomNav.tsx         ← Navigazione in basso
│   │   └── AdminDashboard.tsx    ← Gestione dati (CRUD)
│   └── lib/
│       └── supabase.ts           ← Client Supabase
├── supabase-schema.sql           ← Schema database
└── .env.example                  ← Variabili d'ambiente
```

---

## 🚀 GUIDA AL DEPLOY (passo per passo)

### STEP 1 — Configura Supabase

1. Vai su [supabase.com](https://supabase.com) e apri il tuo progetto (o creane uno nuovo)
2. Nel menu a sinistra clicca **SQL Editor**
3. Incolla tutto il contenuto del file `supabase-schema.sql`
4. Clicca **Run** (▶️)
5. Vai su **Project Settings → API**
6. Copia:
   - `Project URL` → ti servirà come `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → ti servirà come `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### STEP 2 — Pubblica il codice su GitHub

1. Vai su [github.com](https://github.com) → **New repository**
2. Nome: `usob-app`, visibilità: **Private**
3. **Non** aggiungere README (lo crei vuoto)
4. Copia l'URL del repo (tipo `https://github.com/tuonome/usob-app.git`)
5. Sul tuo computer, apri il Terminale nella cartella `usob-app` e scrivi:

```bash
git init
git add .
git commit -m "prima versione USOB app"
git branch -M main
git remote add origin https://github.com/TUONOME/usob-app.git
git push -u origin main
```

> Se non hai Git installato: [git-scm.com/downloads](https://git-scm.com/downloads)

---

### STEP 3 — Deploy su Vercel

1. Vai su [vercel.com](https://vercel.com) → **Add New → Project**
2. Collega il tuo account GitHub se non l'hai già fatto
3. Seleziona il repository `usob-app`
4. Prima di cliccare Deploy, clicca **Environment Variables** e aggiungi:

| Nome | Valore |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | (il tuo Project URL di Supabase) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (il tuo anon key di Supabase) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | (scegli una password per l'area admin) |

5. Clicca **Deploy** — aspetta 2-3 minuti
6. Vercel ti darà un URL tipo `usob-app.vercel.app` — l'app è online! 🎉

---

## 🔄 Come aggiornare l'app in futuro

Ogni volta che modifichi il codice, basta fare:
```bash
git add .
git commit -m "descrizione modifica"
git push
```
Vercel si aggiorna automaticamente in 1-2 minuti.

---

## 📱 Funzionalità

| Sezione | Cosa fa |
|---------|---------|
| **Home** | Riepilogo prossimi impegni, rosa, marcatori, paste, link Instagram |
| **Calendario** | Tutte le partite con risultati, cliccabili per i dettagli del match |
| **Analytics** | Marcatori in ordine, classifica con USOB evidenziato, presenze per ruolo |
| **Fun** | Lista paste in ordine cronologico (compleanno o gol) |
| **Admin** | Gestione rosa, inserimento risultati + marcatori + convocati, squadre, classifica |

---

## 🛠️ Sviluppo locale (opzionale)

Se vuoi vedere l'app sul tuo computer prima di pubblicarla:

1. Installa [Node.js](https://nodejs.org) (versione 18 o superiore)
2. Crea il file `.env.local` nella cartella del progetto:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_ADMIN_PASSWORD=la-tua-password
```
3. Nel terminale:
```bash
npm install
npm run dev
```
4. Apri [http://localhost:3000](http://localhost:3000)
