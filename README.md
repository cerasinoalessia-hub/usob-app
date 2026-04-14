# 🔵🟡 USOB Bareggio — Guida pubblicazione beta

---

## STEP 1 — Supabase (database)

1. Vai su **https://supabase.com** → "Start your project" → crea un account gratuito
2. Crea un nuovo progetto:
   - Nome: `usob-bareggio`
   - Password database: scegli una password sicura (salvala!)
   - Regione: `West EU (Ireland)` o simile
3. Aspetta ~2 minuti che il progetto si avvii
4. Vai su **SQL Editor** (menu a sinistra) → "New query"
5. Copia tutto il contenuto di `supabase_schema.sql` e incollalo → clicca **Run**
   - Questo crea le tabelle e inserisce tutti i dati iniziali
6. Vai su **Project Settings** → **API**:
   - Copia il **Project URL** → es. `https://abcdefgh.supabase.co`
   - Copia la **anon public key** → es. `eyJhbGci...`
   - Ti serviranno nei passi successivi

---

## STEP 2 — GitHub (repository)

1. Vai su **https://github.com** → crea un account se non ce l'hai
2. Clicca **"New repository"**:
   - Nome: `usob-bareggio`
   - Visibilità: **Private** (consigliato)
   - NON spuntare "Add README"
3. Sul tuo computer, apri il Terminale nella cartella del progetto ed esegui:

```bash
# Installa le dipendenze
npm install

# Inizializza git
git init
git add .
git commit -m "Prima versione USOB app"

# Collega a GitHub (sostituisci TUO_USERNAME)
git remote add origin https://github.com/TUO_USERNAME/usob-bareggio.git
git branch -M main
git push -u origin main
```

---

## STEP 3 — Vercel (hosting)

1. Vai su **https://vercel.com** → "Sign up with GitHub"
2. Clicca **"Add New Project"** → seleziona il repository `usob-bareggio`
3. Nella schermata di configurazione, prima di cliccare Deploy, vai su:
   **"Environment Variables"** e aggiungi:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://abcdefgh.supabase.co` (il tuo Project URL) |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (la tua anon key) |

4. Clicca **Deploy** → Vercel builderà e pubblicherà l'app
5. Dopo ~1 minuto riceverai un link tipo `https://usob-bareggio.vercel.app` 🎉

---

## STEP 4 — Sviluppo locale (opzionale)

Per lavorare in locale sul tuo computer:

```bash
# Crea il file delle variabili d'ambiente locali
cp .env.example .env.local

# Modifica .env.local con i tuoi valori Supabase
# VITE_SUPABASE_URL=https://...
# VITE_SUPABASE_ANON_KEY=eyJ...

# Avvia il server di sviluppo
npm run dev
# → apri http://localhost:5173
```

---

## Come funziona il deploy automatico

Ogni volta che fai modifiche e le mandi su GitHub:

```bash
git add .
git commit -m "Descrizione modifica"
git push
```

Vercel rileva automaticamente il push e pubblica la nuova versione in ~1 minuto.

---

## Note per la beta

- **Password staff**: attualmente è `usob2024` — cambiala direttamente nel codice (`App.jsx`, cerca `usob2024`)
- **Dati condivisi**: tutte le modifiche fatte dallo staff (partite, rosa, classifica) sono immediatamente visibili a tutti i dispositivi grazie a Supabase
- **Piano gratuito Supabase**: supporta fino a 50.000 richieste/mese e 500MB di storage — più che sufficiente per questa app
- **Piano gratuito Vercel**: nessun limite per progetti personali/piccoli

---

## Struttura file del progetto

```
usob-bareggio/
├── src/
│   ├── App.jsx          ← tutta l'app React
│   ├── main.jsx         ← entry point
│   └── supabase.js      ← client Supabase
├── index.html           ← pagina HTML
├── vite.config.js       ← configurazione Vite
├── package.json         ← dipendenze
├── .env.example         ← template variabili d'ambiente
├── .gitignore           ← file ignorati da git
└── supabase_schema.sql  ← schema database (eseguilo su Supabase)
```
