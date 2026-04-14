-- ================================================
-- USOB BAREGGIO - Schema Database Supabase
-- Esegui questo script nell'SQL Editor di Supabase
-- ================================================

-- ROSA
create table if not exists rosa (
  id bigint primary key generated always as identity,
  numero integer not null,
  cognome text not null,
  nome text not null,
  ruolo text not null,
  nascita date,
  gol integer default 0,
  presenze integer default 0,
  created_at timestamptz default now()
);

-- SQUADRE AVVERSARIE
create table if not exists squadre (
  id bigint primary key generated always as identity,
  nome text not null,
  indirizzo text default '',
  colori text default '',
  note text default '',
  created_at timestamptz default now()
);

-- CLASSIFICA
create table if not exists classifica (
  id bigint primary key generated always as identity,
  squadra text not null unique,
  g integer default 0,
  v integer default 0,
  p integer default 0,
  s integer default 0,
  gf integer default 0,
  gs integer default 0,
  pt integer default 0
);

-- PARTITE
create table if not exists partite (
  id bigint primary key generated always as identity,
  data date not null,
  casa text not null,
  ospite text not null,
  luogo text default '',
  risultato text,
  fatta boolean default false,
  marcatori text[] default '{}',
  note text default '',
  created_at timestamptz default now()
);

-- ================================================
-- DATI INIZIALI
-- ================================================

insert into rosa (numero, cognome, nome, ruolo, nascita, gol, presenze) values
  (1,  'Rossi',    'Marco',      'Portiere',       '1995-03-15', 0, 10),
  (2,  'Martini',  'Paolo',      'Difensore',       '1996-08-18', 0, 9),
  (3,  'Ferrari',  'Luca',       'Difensore',       '1997-07-22', 1, 9),
  (4,  'De Luca',  'Giorgio',    'Centrocampista',  '1999-04-07', 1, 6),
  (5,  'Bianchi',  'Andrea',     'Difensore',       '1999-11-08', 0, 8),
  (6,  'Romano',   'Davide',     'Difensore',       '1996-02-14', 2, 10),
  (7,  'Gallo',    'Roberto',    'Attaccante',      '2001-05-11', 4, 7),
  (8,  'Colombo',  'Matteo',     'Centrocampista',  '1998-06-30', 3, 10),
  (9,  'Conti',    'Alessandro', 'Attaccante',      '1997-12-25', 6, 10),
  (10, 'Ricci',    'Stefano',    'Centrocampista',  '2000-01-19', 5, 9),
  (11, 'Esposito', 'Fabio',      'Attaccante',      '1994-09-03', 7, 8);

insert into squadre (nome, indirizzo, colori, note) values
  ('USOB Bareggio',    'Via dello Sport 1, Bareggio (MI)',       'Blu e Giallo',      'Campo principale'),
  ('Nerviano FC',      'Via Roma 12, Nerviano (MI)',             'Rosso e Nero',      ''),
  ('Rescaldina Calcio','Via Dante 5, Rescaldina (MI)',           'Verde e Bianco',    ''),
  ('AC Vittuone',      'Piazza del Campo, Vittuone (MI)',        'Blu e Bianco',      ''),
  ('Castellanza FC',   'Via Mazzini 3, Castellanza (VA)',        'Arancione e Nero',  'Erba sintetica'),
  ('Canegrate Sp.',    'Via Garibaldi 7, Canegrate (MI)',        'Giallo e Blu',      ''),
  ('Ossona United',    'Via del Campo 2, Ossona (MI)',           'Rosso e Bianco',    ''),
  ('Busto Garolfo',    'Largo Sportivo 1, Busto Garolfo (MI)',   'Nero e Verde',      ''),
  ('Inveruno 1930',    'Via Lombardia 14, Inveruno (MI)',        'Viola e Bianco',    'Spogliatoi piccoli');

insert into classifica (squadra, g, v, p, s, gf, gs, pt) values
  ('USOB Bareggio',    5, 4, 1, 0, 14, 4,  13),
  ('Nerviano FC',      5, 3, 1, 1, 10, 5,  10),
  ('Rescaldina Calcio',5, 3, 0, 2,  8, 7,   9),
  ('AC Vittuone',      5, 2, 1, 2,  7, 8,   7),
  ('Castellanza FC',   5, 2, 0, 3,  6, 10,  6),
  ('Canegrate Sp.',    5, 1, 1, 3,  5, 9,   4),
  ('Ossona United',    5, 1, 1, 3,  4, 8,   4),
  ('Busto Garolfo',    5, 1, 0, 4,  3, 11,  3),
  ('Inveruno 1930',    5, 0, 1, 4,  2, 12,  1);

insert into partite (data, casa, ospite, luogo, risultato, fatta, marcatori, note) values
  ('2024-09-08', 'USOB Bareggio',    'AC Vittuone',    'Bareggio',   '3-1', true,  array['Esposito','Conti','Conti'],              'Ottima prestazione, pressing alto per tutta la partita.'),
  ('2024-09-15', 'Nerviano FC',      'USOB Bareggio',  'Nerviano',   '0-2', true,  array['Ricci','Gallo'],                         'Campo in erba sintetica, porta da casa le scarpette adatte.'),
  ('2024-09-22', 'USOB Bareggio',    'Ossona United',  'Bareggio',   '2-2', true,  array['Colombo','Esposito'],                    ''),
  ('2024-10-06', 'Rescaldina Calcio','USOB Bareggio',  'Rescaldina', '1-3', true,  array['Conti','Esposito','Romano'],             'Buona gara in trasferta, disciplina tattica.'),
  ('2024-10-13', 'USOB Bareggio',    'Castellanza FC', 'Bareggio',   '4-0', true,  array['Esposito','Ricci','Conti','Gallo'],      'Miglior partita della stagione!'),
  ('2024-10-27', 'Canegrate Sp.',    'USOB Bareggio',  'Canegrate',  null,  false, array[]::text[],                                'Ritrovo alle 14:30 al campo. Maglie bianche.'),
  ('2024-11-03', 'USOB Bareggio',    'Busto Garolfo',  'Bareggio',   null,  false, array[]::text[],                                ''),
  ('2024-11-10', 'Inveruno 1930',    'USOB Bareggio',  'Inveruno',   null,  false, array[]::text[],                                'Attenzione: campo con spogliatoi piccoli.');

-- ================================================
-- SICUREZZA: Row Level Security
-- Lettura pubblica, scrittura solo autenticati
-- (Per ora disabilitata per semplicità della beta)
-- ================================================

alter table rosa       enable row level security;
alter table squadre    enable row level security;
alter table classifica enable row level security;
alter table partite    enable row level security;

-- Policy: tutti possono leggere
create policy "Lettura pubblica rosa"       on rosa       for select using (true);
create policy "Lettura pubblica squadre"    on squadre    for select using (true);
create policy "Lettura pubblica classifica" on classifica for select using (true);
create policy "Lettura pubblica partite"    on partite    for select using (true);

-- Policy: tutti possono scrivere (beta - da proteggere con auth in produzione)
create policy "Scrittura beta rosa"         on rosa       for all using (true) with check (true);
create policy "Scrittura beta squadre"      on squadre    for all using (true) with check (true);
create policy "Scrittura beta classifica"   on classifica for all using (true) with check (true);
create policy "Scrittura beta partite"      on partite    for all using (true) with check (true);
