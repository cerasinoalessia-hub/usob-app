-- ============================================
-- USOB BAREGGIO - Schema Supabase
-- Incolla questo nell'SQL Editor di Supabase
-- ============================================

-- Giocatori
create table giocatori (
  id serial primary key,
  numero integer not null,
  nome text not null,
  cognome text not null,
  ruolo text not null check (ruolo in ('POR','DIF','CEN','ATT')),
  data_nascita date,
  created_at timestamp with time zone default now()
);

-- Squadre avversarie
create table squadre (
  id serial primary key,
  nome text not null,
  indirizzo text,
  colori text,
  note text,
  created_at timestamp with time zone default now()
);

-- Partite
create table partite (
  id serial primary key,
  data date not null,
  squadra_id integer references squadre(id),
  casa boolean default true,
  gol_casa integer,
  gol_trasferta integer,
  created_at timestamp with time zone default now()
);

-- Gol (marcatori per partita)
create table gol (
  id serial primary key,
  partita_id integer references partite(id) on delete cascade,
  giocatore_id integer references giocatori(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Convocazioni per partita
create table convocazioni (
  id serial primary key,
  partita_id integer references partite(id) on delete cascade,
  giocatore_id integer references giocatori(id) on delete cascade
);

-- Classifica (inserita manualmente, aggiornabile)
create table classifica (
  id serial primary key,
  nome text not null,
  punti integer default 0,
  usob boolean default false
);

-- Paste (lista chi deve portare le paste)
create table paste (
  id serial primary key,
  giocatore_id integer references giocatori(id) on delete cascade,
  tipo text check (tipo in ('gol','compleanno')),
  motivo text,
  data_prevista date,
  portato boolean default false,
  created_at timestamp with time zone default now()
);

-- ============================================
-- VIEWS (viste calcolate automaticamente)
-- ============================================

-- Vista marcatori: totale gol per giocatore
create view marcatori_view as
  select
    g.id,
    g.nome,
    g.cognome,
    g.ruolo,
    count(go.id) as gol
  from giocatori g
  join gol go on go.giocatore_id = g.id
  group by g.id, g.nome, g.cognome, g.ruolo;

-- Vista presenze: convocazioni per giocatore
create view presenze_view as
  select
    g.id,
    g.nome,
    g.cognome,
    g.ruolo,
    count(c.id) as presenze
  from giocatori g
  left join convocazioni c on c.giocatore_id = g.id
  group by g.id, g.nome, g.cognome, g.ruolo;

-- ============================================
-- DATI INIZIALI DI ESEMPIO (opzionale)
-- ============================================

insert into classifica (nome, punti, usob) values
  ('USOB Bareggio', 0, true),
  ('Squadra B', 0, false),
  ('Squadra C', 0, false);

-- ============================================
-- PERMESSI (Row Level Security)
-- Tutti possono leggere, solo il server scrive
-- ============================================

alter table giocatori enable row level security;
alter table partite enable row level security;
alter table gol enable row level security;
alter table convocazioni enable row level security;
alter table squadre enable row level security;
alter table classifica enable row level security;
alter table paste enable row level security;

-- Permessi di lettura pubblica
create policy "Lettura pubblica" on giocatori for select using (true);
create policy "Lettura pubblica" on partite for select using (true);
create policy "Lettura pubblica" on gol for select using (true);
create policy "Lettura pubblica" on convocazioni for select using (true);
create policy "Lettura pubblica" on squadre for select using (true);
create policy "Lettura pubblica" on classifica for select using (true);
create policy "Lettura pubblica" on paste for select using (true);

-- Permessi di scrittura (anon key può scrivere - la password nell'app protegge l'accesso)
create policy "Scrittura anon" on giocatori for all using (true);
create policy "Scrittura anon" on partite for all using (true);
create policy "Scrittura anon" on gol for all using (true);
create policy "Scrittura anon" on convocazioni for all using (true);
create policy "Scrittura anon" on squadre for all using (true);
create policy "Scrittura anon" on classifica for all using (true);
create policy "Scrittura anon" on paste for all using (true);
