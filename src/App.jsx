import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase.js";

const COLORS = {
  blu: "#003399",
  bluDark: "#001f66",
  bluLight: "#1a4db3",
  giallo: "#FFD700",
  gialloLight: "#FFE44D",
  gialloMuted: "#FFF3B0",
  white: "#FFFFFF",
  gray50: "#F8F9FA",
  gray100: "#F1F3F5",
  gray200: "#E9ECEF",
  gray400: "#ADB5BD",
  gray600: "#6C757D",
  gray800: "#343A40",
};

// ─── Supabase data hook ────────────────────────────────────────────────────

function useTable(table, orderBy = "id") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from(table).select("*").order(orderBy);
    setData(rows || []);
    setLoading(false);
  }, [table, orderBy]);

  useEffect(() => { fetch(); }, [fetch]);

  const upsert = async (row) => {
    const { data: result } = await supabase.from(table).insert(row).select().single();
    if (result) setData(prev => [...prev, result]);
    return result;
  };

  const update = async (id, changes) => {
    const { data: result } = await supabase.from(table).update(changes).eq("id", id).select().single();
    if (result) setData(prev => prev.map(r => r.id === id ? result : r));
    return result;
  };

  const remove = async (id) => {
    await supabase.from(table).delete().eq("id", id);
    setData(prev => prev.filter(r => r.id !== id));
  };

  // Inserisce o aggiorna in base alla colonna "chiave"
  const upsertChiave = async (row) => {
    // Prima cerca se esiste già
    const { data: existing } = await supabase
      .from(table)
      .select("id")
      .eq("chiave", row.chiave)
      .single();

    if (existing) {
      // Esiste → aggiorna per id
      const { data: result } = await supabase
        .from(table)
        .update(row)
        .eq("id", existing.id)
        .select()
        .single();
      if (result) {
        setData(prev => prev.map(r => r.id === existing.id ? result : r));
      }
      return result;
    } else {
      // Non esiste → inserisci
      const { data: result } = await supabase
        .from(table)
        .insert(row)
        .select()
        .single();
      if (result) {
        setData(prev => [...prev, result]);
      }
      return result;
    }
  };

  return { data, loading, refetch: fetch, upsert, update, remove, upsertChiave };
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = {
  app: {
    fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
    background: COLORS.gray100,
    minHeight: "100vh",
    paddingBottom: "80px",
  },
  header: {
    background: `linear-gradient(135deg, ${COLORS.bluDark} 0%, ${COLORS.blu} 100%)`,
    padding: "0 16px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
  },
  headerInner: {
    maxWidth: 640, margin: "0 auto",
    display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
  },
  logo: {
    width: 44, height: 44, borderRadius: "50%", background: COLORS.giallo,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: 14, color: COLORS.bluDark, flexShrink: 0,
  },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: 700, letterSpacing: 1, margin: 0 },
  content: { maxWidth: 640, margin: "0 auto", padding: "16px 12px" },
  nav: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    background: COLORS.white, borderTop: `3px solid ${COLORS.giallo}`,
    display: "flex", alignItems: "flex-end", zIndex: 100,
    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)", paddingBottom: 6, minHeight: 68,
  },
  navBtn: (active) => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    padding: "10px 4px 8px", background: "none", border: "none", cursor: "pointer",
    color: active ? COLORS.blu : COLORS.gray400,
    fontFamily: "inherit", fontSize: 10, fontWeight: active ? 700 : 400,
    borderTop: active ? `3px solid ${COLORS.blu}` : "3px solid transparent",
    marginTop: -3, transition: "all 0.15s",
  }),
  card: {
    background: COLORS.white, borderRadius: 12, marginBottom: 12,
    overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    background: COLORS.blu, color: COLORS.white, padding: "10px 16px",
    fontSize: 13, fontWeight: 700, letterSpacing: 1,
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 800, color: COLORS.bluDark, marginBottom: 12,
    letterSpacing: 1, borderLeft: `4px solid ${COLORS.giallo}`,
    paddingLeft: 10, paddingTop: 2, paddingBottom: 2,
  },
  badge: (color = COLORS.giallo) => ({
    background: color,
    color: color === COLORS.giallo ? COLORS.bluDark : COLORS.white,
    borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
  }),
  playerRow: (highlight) => ({
    display: "flex", alignItems: "center", padding: "10px 16px",
    borderBottom: `1px solid ${COLORS.gray100}`,
    background: highlight ? COLORS.gialloMuted : COLORS.white, gap: 12,
  }),
  numero: {
    width: 28, height: 28, borderRadius: 6, background: COLORS.blu, color: COLORS.white,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 800, flexShrink: 0,
  },
  matchRow: (fatta) => ({
    padding: "12px 16px", borderBottom: `1px solid ${COLORS.gray100}`,
    background: fatta ? COLORS.white : "#FFFBEB", cursor: "pointer",
  }),
};

// ─── NavIcon ───────────────────────────────────────────────────────────────

const NavIcon = ({ name }) => {
  const icons = {
    home:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    calendario: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    analytics:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    fun:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
    area:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  };
  return icons[name] || null;
};

// ─── Spinner ───────────────────────────────────────────────────────────────

const Spinner = () => (
  <div style={{ textAlign: "center", padding: 32 }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <div style={{ width: 28, height: 28, border: `3px solid ${COLORS.gray200}`, borderTopColor: COLORS.blu, borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 8px" }} />
    <div style={{ fontSize: 13, color: COLORS.gray400 }}>Caricamento…</div>
  </div>
);

// ─── HOME ──────────────────────────────────────────────────────────────────

function HomeSection({ rosa, partite, classifica, loading }) {
  const [expanded, setExpanded] = useState(false);
  const prossimi = partite.filter(p => !p.fatta).slice(0, 3);
  const marcatori = [...rosa].filter(p => p.gol > 0).sort((a, b) => b.gol - a.gol).slice(0, 5);
  const sorted = [...classifica].sort((a, b) => b.pt - a.pt);
  const myPos = sorted.findIndex(c => c.squadra === "USOB Bareggio") + 1;
  const myPt = classifica.find(c => c.squadra === "USOB Bareggio")?.pt || 0;
  const totalGol = rosa.reduce((s, p) => s + (p.gol || 0), 0);
  const rosaVisible = expanded ? rosa : rosa.slice(0, 5);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ ...styles.logo, width: 52, height: 52, fontSize: 16 }}>USOB</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.bluDark, lineHeight: 1 }}>U.S. O.B. Bareggio</div>
          <div style={{ fontSize: 12, color: COLORS.gray600, letterSpacing: 1 }}>BAREGGIO (MI)</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label: myPos ? `${myPos}°` : "–", sub: "Classifica" },
          { label: totalGol, sub: "Gol fatti" },
          { label: `${myPt}pt`, sub: "Punti" },
        ].map((s, i) => (
          <div key={i} style={{ background: i === 0 ? COLORS.giallo : COLORS.blu, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: i === 0 ? COLORS.bluDark : COLORS.white }}>{s.label}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: i === 0 ? COLORS.bluDark : COLORS.gialloLight, opacity: 0.85 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>PROSSIME PARTITE</div>
        {loading ? <Spinner /> : prossimi.length === 0
          ? <div style={{ padding: 16, fontSize: 13, color: COLORS.gray400, textAlign: "center" }}>Nessuna partita in programma</div>
          : prossimi.map(p => (
            <div key={p.id} style={{ padding: "10px 16px", borderBottom: `1px solid ${COLORS.gray100}` }}>
              <div style={{ fontSize: 11, color: COLORS.gray600, marginBottom: 2 }}>
                {new Date(p.data).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "long" })} — {p.luogo}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.bluDark }}>
                {p.casa} <span style={{ color: COLORS.gray400 }}>vs</span> {p.ospite}
              </div>
            </div>
          ))
        }
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>ROSA SQUADRA <span style={{ fontSize: 11, opacity: 0.7 }}>{rosa.length} giocatori</span></div>
        {loading ? <Spinner /> : <>
          {rosaVisible.map(p => (
            <div key={p.id} style={styles.playerRow(false)}>
              <div style={styles.numero}>{p.numero}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{p.cognome}</span> <span style={{ fontSize: 14 }}>{p.nome}</span>
              </div>
              <span style={{ fontSize: 12, color: COLORS.gray600 }}>{p.ruolo}</span>
            </div>
          ))}
          {!expanded && rosa.length > 5 && (
            <button onClick={() => setExpanded(true)} style={{ width: "100%", padding: "10px", background: COLORS.gray50, border: "none", borderTop: `1px solid ${COLORS.gray100}`, cursor: "pointer", fontSize: 13, color: COLORS.blu, fontWeight: 700, fontFamily: "inherit" }}>
              + {rosa.length - 5} altri giocatori ▾
            </button>
          )}
          {expanded && (
            <button onClick={() => setExpanded(false)} style={{ width: "100%", padding: "10px", background: COLORS.gray50, border: "none", borderTop: `1px solid ${COLORS.gray100}`, cursor: "pointer", fontSize: 13, color: COLORS.gray600, fontWeight: 600, fontFamily: "inherit" }}>
              Mostra meno ▴
            </button>
          )}
        </>}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>⚽ MARCATORI</div>
        {loading ? <Spinner /> : marcatori.map((p, i) => (
          <div key={p.id} style={styles.playerRow(i === 0)}>
            <div style={{ width: 24, textAlign: "center", fontWeight: 800, color: i === 0 ? COLORS.blu : COLORS.gray600, fontSize: 14 }}>#{i + 1}</div>
            <div style={{ flex: 1, fontSize: 14 }}>
              <span style={{ fontWeight: 700 }}>{p.cognome}</span> {p.nome}
              <span style={{ fontSize: 11, color: COLORS.gray600, display: "block" }}>{p.ruolo}</span>
            </div>
            <div style={{ ...styles.badge(), fontSize: 14, fontWeight: 900 }}>{p.gol} ⚽</div>
          </div>
        ))}
      </div>

      <div style={{ ...styles.card, background: COLORS.blu }}>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28 }}>📸</div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 15 }}>Seguici su Instagram</div>
            <div style={{ color: COLORS.giallo, fontSize: 13 }}>@usob_open_calcio</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <a href="https://instagram.com/usob_open_calcio" style={{ ...styles.badge(COLORS.giallo), textDecoration: "none", padding: "6px 14px", fontSize: 13 }}>Visita ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CALENDARIO ────────────────────────────────────────────────────────────

function CalendarioSection({ partite, classifica, loading }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const match = partite.find(p => p.id === selected.id) || selected;
    const sorted = [...classifica].sort((a, b) => b.pt - a.pt);
    const myPos = sorted.findIndex(c => c.squadra === "USOB Bareggio") + 1;
    const avversaria = match.casa === "USOB Bareggio" ? match.ospite : match.casa;
    const oppPos = sorted.findIndex(c => c.squadra === avversaria) + 1;

    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.blu, fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
          ← Torna al calendario
        </button>
        <div style={{ ...styles.card, marginBottom: 0 }}>
          <div style={{ background: COLORS.blu, padding: "16px", textAlign: "center" }}>
            <div style={{ color: COLORS.giallo, fontSize: 11, letterSpacing: 2, marginBottom: 4 }}>
              {new Date(match.data).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div style={{ color: COLORS.white, fontSize: 18, fontWeight: 800 }}>{match.casa}</div>
            <div style={{ color: COLORS.giallo, fontWeight: 900, fontSize: 28, margin: "8px 0" }}>
              {match.fatta ? match.risultato : "– : –"}
            </div>
            <div style={{ color: COLORS.white, fontSize: 18, fontWeight: 800 }}>{match.ospite}</div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={{ background: COLORS.gray50, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: COLORS.gray600, marginBottom: 4 }}>USOB Bareggio</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.blu }}>{myPos || "–"}°</div>
                <div style={{ fontSize: 11, color: COLORS.gray400 }}>in classifica</div>
              </div>
              <div style={{ background: COLORS.gray50, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: COLORS.gray600, marginBottom: 4 }}>{avversaria}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.gray600 }}>{oppPos || "–"}°</div>
                <div style={{ fontSize: 11, color: COLORS.gray400 }}>in classifica</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: COLORS.gray600, marginBottom: 10 }}>📍 <strong>Luogo:</strong> {match.luogo}</div>
            {match.marcatori?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.bluDark, marginBottom: 6 }}>⚽ Marcatori:</div>
                {match.marcatori.map((m, i) => <div key={i} style={{ fontSize: 13, color: COLORS.gray800, padding: "3px 0" }}>• {m}</div>)}
              </div>
            )}
            {match.note ? (
              <div style={{ background: COLORS.gialloMuted, borderRadius: 8, padding: "10px 12px", borderLeft: `3px solid ${COLORS.giallo}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.bluDark, marginBottom: 4 }}>📝 NOTE STAFF</div>
                <div style={{ fontSize: 13, color: COLORS.gray800 }}>{match.note}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const MatchRow = ({ p }) => (
    <div style={styles.matchRow(p.fatta)} onClick={() => setSelected(p)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.gray600, marginBottom: 2 }}>
            {new Date(p.data).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })} — {p.luogo}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.bluDark, lineHeight: 1.3 }}>
            {p.casa} <span style={{ color: COLORS.gray400, fontWeight: 400 }}>vs</span> {p.ospite}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 900, fontSize: 16, color: p.fatta ? COLORS.blu : COLORS.gray400 }}>
            {p.fatta ? p.risultato : "–"}
          </span>
          <span style={{ color: COLORS.gray400, fontSize: 16 }}>›</span>
        </div>
      </div>
    </div>
  );

  const giocate = partite.filter(p => p.fatta);
  const programmate = partite.filter(p => !p.fatta);

  return (
    <div>
      <div style={styles.sectionTitle}>CALENDARIO</div>
      {loading ? <Spinner /> : <>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray600, letterSpacing: 1, marginBottom: 6, paddingLeft: 4 }}>IN PROGRAMMA</div>
        <div style={{ ...styles.card, marginBottom: 14 }}>
          {programmate.length === 0
            ? <div style={{ padding: 16, fontSize: 13, color: COLORS.gray400, textAlign: "center" }}>Nessuna partita in programma</div>
            : programmate.map(p => <MatchRow key={p.id} p={p} />)
          }
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray600, letterSpacing: 1, marginBottom: 6, paddingLeft: 4 }}>GIÀ GIOCATE</div>
        <div style={styles.card}>
          {[...giocate].reverse().map(p => <MatchRow key={p.id} p={p} />)}
        </div>
      </>}
    </div>
  );
}

// ─── ANALYTICS ─────────────────────────────────────────────────────────────

function AnalyticsSection({ rosa, classifica, loading }) {
  const marcatori = [...rosa].filter(p => p.gol > 0).sort((a, b) => b.gol - a.gol);
  const maxGol = marcatori[0]?.gol || 1;
  const sorted = [...classifica].sort((a, b) => b.pt - a.pt);
  const ruoli = ["Portiere", "Difensore", "Centrocampista", "Attaccante"];

  return (
    <div>
      <div style={styles.sectionTitle}>ANALYTICS</div>
      {loading ? <Spinner /> : <>
        <div style={styles.card}>
          <div style={styles.cardHeader}>⚽ MARCATORI</div>
          {marcatori.map((p, i) => (
            <div key={p.id} style={{ padding: "10px 16px", borderBottom: `1px solid ${COLORS.gray100}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{p.cognome} {p.nome}</span>
                <span style={{ ...styles.badge(), fontWeight: 800, fontSize: 13 }}>{p.gol} ⚽</span>
              </div>
              <div style={{ height: 6, background: COLORS.gray100, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(p.gol / maxGol) * 100}%`, background: i === 0 ? COLORS.giallo : COLORS.blu, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>🏆 CLASSIFICA</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: COLORS.gray50, color: COLORS.gray600, fontSize: 11 }}>
                  {["#","Squadra","G","V","P","S","Gf","Gs","Pt"].map(h => (
                    <th key={h} style={{ padding: "8px 8px", textAlign: h === "Squadra" ? "left" : "center", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((c, i) => (
                  <tr key={c.id} style={{ background: c.squadra === "USOB Bareggio" ? COLORS.gialloMuted : COLORS.white, borderBottom: `1px solid ${COLORS.gray100}` }}>
                    <td style={{ padding: "8px 8px", textAlign: "center", fontWeight: 800, color: COLORS.gray600 }}>{i + 1}</td>
                    <td style={{ padding: "8px 8px", fontWeight: c.squadra === "USOB Bareggio" ? 800 : 400, color: COLORS.bluDark }}>{c.squadra}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center" }}>{c.g}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center", color: "#2d8a2d" }}>{c.v}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center", color: COLORS.gray600 }}>{c.p}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center", color: "#c0392b" }}>{c.s}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center" }}>{c.gf}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center" }}>{c.gs}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center", fontWeight: 800, color: COLORS.blu }}>{c.pt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>📋 PRESENZE PER RUOLO</div>
          {ruoli.map(r => {
            const g = [...rosa].filter(p => p.ruolo === r).sort((a, b) => a.cognome.localeCompare(b.cognome));
            if (!g.length) return null;
            return (
              <div key={r}>
                <div style={{ background: COLORS.gray50, padding: "6px 16px", fontSize: 11, fontWeight: 700, color: COLORS.gray600, letterSpacing: 1 }}>{r.toUpperCase()}</div>
                {g.map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 16px", borderBottom: `1px solid ${COLORS.gray100}` }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={styles.numero}>{p.numero}</div>
                      <span style={{ fontSize: 14 }}>{p.cognome} {p.nome}</span>
                    </div>
                    <span style={{ ...styles.badge(COLORS.blu), color: COLORS.white }}>{p.presenze} 🟢</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </>}
    </div>
  );
}

// ─── Helper: costruisce lista paste da gol + compleanni ────────────────────

function buildPasteList(rosa, partite, pasteDb) {
  const oggi = new Date();
  const annoCorrente = oggi.getFullYear();
  const lista = [];

  // 1. Un gol = una pasta, con data della partita
  partite
    .filter(p => p.fatta && Array.isArray(p.marcatori) && p.marcatori.length > 0)
    .forEach(partita => {
      // Conta quante volte ogni cognome appare nei marcatori
      const conteggio = {};
      partita.marcatori.forEach(m => { conteggio[m] = (conteggio[m] || 0) + 1; });
      Object.entries(conteggio).forEach(([cognome, numGol]) => {
        const giocatore = rosa.find(r => r.cognome === cognome);
        for (let i = 0; i < numGol; i++) {
          const chiave = `gol_${partita.id}_${cognome}_${i}`;
          const rec = pasteDb.find(x => x.chiave === chiave);
          const avversaria = partita.casa === "USOB Bareggio" ? partita.ospite : partita.casa;
          lista.push({
            chiave,
            cognome: giocatore ? giocatore.cognome : cognome,
            nome: giocatore ? giocatore.nome : "",
            motivo: `⚽ Gol vs ${avversaria}`,
            data: partita.data,
            portate: rec ? rec.portate : false,
            dbId: rec ? rec.id : null,
          });
        }
      });
    });

  // 2. Un compleanno = una pasta, con data del prossimo compleanno
  rosa
    .filter(g => g.nascita)
    .forEach(g => {
      const nascita = new Date(g.nascita);
      let dataCompl = new Date(annoCorrente, nascita.getMonth(), nascita.getDate());
      // Se il compleanno è già passato quest'anno, usa l'anno prossimo
      if (dataCompl < oggi) {
        dataCompl = new Date(annoCorrente + 1, nascita.getMonth(), nascita.getDate());
      }
      const chiave = `compl_${g.id}_${dataCompl.getFullYear()}`;
      const rec = pasteDb.find(x => x.chiave === chiave);
      lista.push({
        chiave,
        cognome: g.cognome,
        nome: g.nome,
        motivo: `🎂 Compleanno ${dataCompl.getFullYear()}`,
        data: dataCompl.toISOString().split("T")[0],
        portate: rec ? rec.portate : false,
        dbId: rec ? rec.id : null,
      });
    });

  // Ordine cronologico
  lista.sort((a, b) => new Date(a.data) - new Date(b.data));
  return lista;
}

// ─── FUN ───────────────────────────────────────────────────────────────────

function FunSection({ rosa, partite, paste, loading }) {
  const lista = buildPasteList(rosa, partite, paste);
  const daPortare = lista.filter(p => !p.portate);
  const giàPortate = lista.filter(p => p.portate);

  const PastaRow = ({ p, isFirst }) => (
    <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.gray100}`, background: isFirst ? COLORS.gialloMuted : COLORS.white, display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ fontSize: 26 }}>{p.motivo.startsWith("🎂") ? "🎂" : "⚽"}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.bluDark }}>{p.cognome} {p.nome}</div>
        <div style={{ fontSize: 12, color: COLORS.gray600 }}>{p.motivo}</div>
        <div style={{ fontSize: 12, color: COLORS.gray400 }}>
          {new Date(p.data).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>
      {isFirst && <span style={{ ...styles.badge(), fontSize: 11, padding: "4px 10px" }}>PROSSIMO!</span>}
    </div>
  );

  return (
    <div>
      <div style={styles.sectionTitle}>🎂 FUN — LE PASTE</div>
      {loading ? <Spinner /> : <>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray600, letterSpacing: 1, marginBottom: 6, paddingLeft: 4 }}>DA PORTARE</div>
        <div style={{ ...styles.card, marginBottom: 14 }}>
          <div style={{ padding: "12px 16px", background: COLORS.gialloMuted, borderBottom: `1px solid ${COLORS.giallo}` }}>
            <div style={{ fontSize: 13, color: COLORS.bluDark, fontWeight: 600 }}>
              Un gol = una pasta. Un compleanno = una pasta. In ordine cronologico.
            </div>
          </div>
          {daPortare.length === 0
            ? <div style={{ padding: 16, fontSize: 13, color: COLORS.gray400, textAlign: "center" }}>Nessuna pasta in programma 🎉</div>
            : daPortare.map((p, i) => <PastaRow key={p.chiave} p={p} isFirst={i === 0} />)
          }
        </div>

        {giàPortate.length > 0 && <>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray600, letterSpacing: 1, marginBottom: 6, paddingLeft: 4 }}>GIÀ PORTATE ✅</div>
          <div style={{ ...styles.card, opacity: 0.65 }}>
            {giàPortate.map(p => (
              <div key={p.chiave} style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 22 }}>✅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.gray600, textDecoration: "line-through" }}>{p.cognome} {p.nome}</div>
                  <div style={{ fontSize: 12, color: COLORS.gray400 }}>{p.motivo} — {new Date(p.data).toLocaleDateString("it-IT", { day: "numeric", month: "long" })}</div>
                </div>
              </div>
            ))}
          </div>
        </>}
      </>}
    </div>
  );
}

// ─── AREA RISERVATA ────────────────────────────────────────────────────────

function AreaRiservataSection({ rosaHook, partiteHook, classificaHook, squadreHook, pasteHook }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("rosa");
  const [editP, setEditP] = useState(null);
  const [editM, setEditM] = useState(null);
  const [editS, setEditS] = useState(null);
  const [editPasta, setEditPasta] = useState(null);
  const [saving, setSaving] = useState(false);

  const inp = { width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray200}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 6 };
  const lbl = { fontSize: 11, fontWeight: 700, color: COLORS.gray600, display: "block", marginBottom: 2 };
  const saveBtn = { background: COLORS.blu, color: COLORS.white, border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
  const cancelBtn = { background: "none", color: COLORS.gray600, border: `1px solid ${COLORS.gray200}`, borderRadius: 6, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" };
  const delBtn = { background: "none", color: "#c0392b", border: "1px solid #c0392b", borderRadius: 6, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" };

  if (!unlocked) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px" }}>
        <div style={{ ...styles.logo, width: 64, height: 64, fontSize: 20, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.bluDark, marginBottom: 6 }}>Area Riservata</div>
        <div style={{ fontSize: 14, color: COLORS.gray600, marginBottom: 24, textAlign: "center" }}>Accesso solo allo staff</div>
        <input type="password" placeholder="Password" value={pwd}
          onChange={e => { setPwd(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && (pwd === "usob2024" ? setUnlocked(true) : setError(true))}
          style={{ width: "100%", maxWidth: 280, padding: "12px 16px", borderRadius: 8, border: `2px solid ${error ? "#c0392b" : COLORS.gray200}`, fontSize: 15, marginBottom: 12, boxSizing: "border-box" }} />
        {error && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 8 }}>Password errata</div>}
        <button onClick={() => { if (pwd === "usob2024") setUnlocked(true); else setError(true); }}
          style={{ background: COLORS.blu, color: COLORS.white, border: "none", borderRadius: 8, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", maxWidth: 280 }}>
          ACCEDI
        </button>
        <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 8 }}>Password demo: usob2024</div>
      </div>
    );
  }

  const tabs = [{ id: "rosa", label: "Rosa" }, { id: "partite", label: "Partite" }, { id: "paste", label: "Paste 🎂" }, { id: "squadre", label: "Squadre" }, { id: "classifica", label: "Classifica" }];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={styles.sectionTitle}>AREA RISERVATA</div>
        <button onClick={() => setUnlocked(false)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.gray600, fontSize: 12 }}>Esci</button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? COLORS.blu : COLORS.white, color: tab === t.id ? COLORS.white : COLORS.gray600, border: `1px solid ${tab === t.id ? COLORS.blu : COLORS.gray200}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ROSA */}
      {tab === "rosa" && (
        <div>
          {editP && (
            <div style={{ ...styles.card, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.bluDark, marginBottom: 12 }}>{editP.id ? "Modifica giocatore" : "Nuovo giocatore"}</div>
              {[["numero","Numero"],["cognome","Cognome"],["nome","Nome"],["ruolo","Ruolo"],["nascita","Data di nascita"]].map(([f,l]) => (
                <div key={f}><label style={lbl}>{l}</label>
                  <input style={inp} type={f === "nascita" ? "date" : "text"} value={editP[f] || ""} onChange={e => setEditP({ ...editP, [f]: e.target.value })} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <button style={saveBtn} disabled={saving} onClick={async () => { setSaving(true); const { id, ...f } = editP; id ? await rosaHook.update(id, { ...f, numero: Number(f.numero) }) : await rosaHook.upsert({ ...f, numero: Number(f.numero) }); setSaving(false); setEditP(null); }}>{saving ? "…" : "Salva"}</button>
                <button style={cancelBtn} onClick={() => setEditP(null)}>Annulla</button>
                {editP.id && <button style={delBtn} onClick={async () => { await rosaHook.remove(editP.id); setEditP(null); }}>Elimina</button>}
              </div>
            </div>
          )}
          <div style={styles.card}>
            <div style={styles.cardHeader}>ROSA
              <button style={{ background: COLORS.giallo, color: COLORS.bluDark, border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                onClick={() => setEditP({ numero: "", cognome: "", nome: "", ruolo: "Attaccante", nascita: "" })}>+ Aggiungi</button>
            </div>
            {rosaHook.loading ? <Spinner /> : rosaHook.data.map(p => (
              <div key={p.id} style={styles.playerRow(false)}>
                <div style={styles.numero}>{p.numero}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{p.cognome} {p.nome}</span>
                  <span style={{ fontSize: 12, color: COLORS.gray600, display: "block" }}>{p.ruolo}{p.nascita ? ` — ${new Date(p.nascita).toLocaleDateString("it-IT")}` : ""}</span>
                </div>
                <button style={{ background: "none", border: `1px solid ${COLORS.gray200}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }} onClick={() => setEditP({ ...p })}>✏️</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARTITE */}
      {tab === "partite" && (
        <div>
          {editM && (
            <div style={{ ...styles.card, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.bluDark, marginBottom: 12 }}>{editM.id ? "Modifica partita" : "Nuova partita"}</div>
              {/* Casa e Ospite come dropdown */}
              <label style={lbl}>Data</label>
              <input style={inp} type="date" value={editM.data || ""} onChange={e => setEditM({ ...editM, data: e.target.value })} />
              <label style={lbl}>Casa</label>
              <select style={inp} value={editM.casa || ""} onChange={e => setEditM({ ...editM, casa: e.target.value })}>
                <option value="" disabled>Seleziona squadra…</option>
                {squadreHook.data.map(s => <option key={s.id} value={s.nome}>{s.nome}</option>)}
              </select>
              <label style={lbl}>Ospite</label>
              <select style={inp} value={editM.ospite || ""} onChange={e => setEditM({ ...editM, ospite: e.target.value })}>
                <option value="" disabled>Seleziona squadra…</option>
                {squadreHook.data.map(s => <option key={s.id} value={s.nome}>{s.nome}</option>)}
              </select>
              <label style={lbl}>Luogo</label>
              <input style={inp} type="text" value={editM.luogo || ""} onChange={e => setEditM({ ...editM, luogo: e.target.value })} />
              <label style={lbl}>Risultato (es. 2-1)</label>
              <input style={inp} type="text" value={editM.risultato || ""} onChange={e => setEditM({ ...editM, risultato: e.target.value })} />

              {/* MARCATORI */}
              <label style={{ ...lbl, marginTop: 4 }}>⚽ Marcatori</label>
              <div style={{ background: COLORS.gray50, borderRadius: 8, padding: 10, marginBottom: 6 }}>
                {(editM.marcatori || []).length === 0 && (
                  <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 6 }}>Nessun marcatore aggiunto</div>
                )}
                {(editM.marcatori || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                    <span style={{ fontSize: 13 }}>⚽ {m}</span>
                    <button onClick={() => setEditM({ ...editM, marcatori: editM.marcatori.filter((_, idx) => idx !== i) })}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontSize: 16, padding: "0 4px" }}>×</button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <select
                    id="marcatore-select"
                    style={{ ...inp, marginBottom: 0, flex: 1 }}
                    defaultValue=""
                  >
                    <option value="" disabled>Seleziona giocatore…</option>
                    {rosaHook.data.map(p => (
                      <option key={p.id} value={p.cognome}>{p.cognome} {p.nome}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const sel = document.getElementById("marcatore-select");
                      if (sel.value) {
                        setEditM({ ...editM, marcatori: [...(editM.marcatori || []), sel.value] });
                        sel.value = "";
                      }
                    }}
                    style={{ background: COLORS.blu, color: COLORS.white, border: "none", borderRadius: 6, padding: "0 14px", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>+</button>
                </div>
              </div>

              <label style={lbl}>Note staff</label>
              <textarea style={{ ...inp, resize: "vertical", minHeight: 60 }} value={editM.note || ""} onChange={e => setEditM({ ...editM, note: e.target.value })} />
              <label style={{ ...lbl, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 12 }}>
                <input type="checkbox" checked={!!editM.fatta} onChange={e => setEditM({ ...editM, fatta: e.target.checked })} /> Già giocata
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={saveBtn} disabled={saving} onClick={async () => {
                  setSaving(true);
                  const { id, ...f } = editM;
                  const payload = { ...f, fatta: !!f.fatta, marcatori: f.marcatori || [] };
                  if (id) await partiteHook.update(id, payload);
                  else await partiteHook.upsert(payload);
                  setSaving(false);
                  setEditM(null);
                }}>{saving ? "…" : "Salva"}</button>
                <button style={cancelBtn} onClick={() => setEditM(null)}>Annulla</button>
                {editM.id && <button style={delBtn} onClick={async () => { await partiteHook.remove(editM.id); setEditM(null); }}>Elimina</button>}
              </div>
            </div>
          )}
          <div style={styles.card}>
            <div style={styles.cardHeader}>PARTITE
              <button style={{ background: COLORS.giallo, color: COLORS.bluDark, border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                onClick={() => setEditM({ data: "", casa: "USOB Bareggio", ospite: "", luogo: "", risultato: "", fatta: false, note: "", marcatori: [] })}>+ Aggiungi</button>
            </div>
            {partiteHook.loading ? <Spinner /> : partiteHook.data.map(p => (
              <div key={p.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.gray600 }}>{new Date(p.data).toLocaleDateString("it-IT")}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{p.casa} vs {p.ospite}</div>
                  {p.marcatori?.length > 0 && <div style={{ fontSize: 11, color: COLORS.gray600 }}>⚽ {p.marcatori.join(", ")}</div>}
                  {p.note ? <div style={{ fontSize: 11, color: COLORS.gray400 }}>📝 {p.note.slice(0,40)}{p.note.length > 40 ? "…" : ""}</div> : null}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {p.fatta && <span style={styles.badge()}>{p.risultato}</span>}
                  <button style={{ background: "none", border: `1px solid ${COLORS.gray200}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }} onClick={() => setEditM({ ...p })}>✏️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASTE */}
      {tab === "paste" && (() => {
        const lista = buildPasteList(rosaHook.data, partiteHook.data, pasteHook.data);
        const daPortare = lista.filter(p => !p.portate);
        const giàPortate = lista.filter(p => p.portate);

        const toggle = async (item, nuovoValore) => {
          await pasteHook.upsertChiave({
            chiave: item.chiave,
            cognome: item.cognome,
            nome: item.nome,
            motivo: item.motivo,
            data: item.data,
            portate: nuovoValore,
          });
        };

        const isLoading = rosaHook.loading || partiteHook.loading || pasteHook.loading;

        return (
          <div style={styles.card}>
            <div style={styles.cardHeader}>PASTE 🎂</div>
            {isLoading ? <Spinner /> : <>
              {lista.length === 0 && (
                <div style={{ padding: 16, fontSize: 13, color: COLORS.gray400, textAlign: "center" }}>
                  Nessuna pasta — inserisci partite con marcatori o giocatori con data di nascita
                </div>
              )}

              {daPortare.map((p, i) => (
                <div key={p.chiave} style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: i === 0 ? COLORS.gialloMuted : COLORS.white }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{p.cognome} {p.nome}</div>
                    <div style={{ fontSize: 12, color: COLORS.gray600 }}>{p.motivo}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400 }}>
                      {new Date(p.data).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>
                  <button
                    style={{ background: COLORS.giallo, color: COLORS.bluDark, border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
                    onClick={() => toggle(p, true)}>
                    ✅ Portate
                  </button>
                </div>
              ))}

              {giàPortate.length > 0 && <>
                <div style={{ background: COLORS.gray50, padding: "6px 16px", fontSize: 11, fontWeight: 700, color: COLORS.gray600, letterSpacing: 1 }}>GIÀ PORTATE</div>
                {giàPortate.map(p => (
                  <div key={p.chiave} style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.gray50, opacity: 0.7 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, textDecoration: "line-through", color: COLORS.gray600 }}>{p.cognome} {p.nome}</div>
                      <div style={{ fontSize: 12, color: COLORS.gray400 }}>{p.motivo}</div>
                      <div style={{ fontSize: 11, color: COLORS.gray400 }}>
                        {new Date(p.data).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <button
                      style={{ background: "none", border: `1px solid ${COLORS.gray200}`, borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer", color: COLORS.gray600, flexShrink: 0 }}
                      onClick={() => toggle(p, false)}>
                      ↩️ Da portare
                    </button>
                  </div>
                ))}
              </>}
            </>}
          </div>
        );
      })()}

      {/* SQUADRE */}
      {tab === "squadre" && (
        <div>
          {editS && (
            <div style={{ ...styles.card, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.bluDark, marginBottom: 12 }}>{editS.id ? "Modifica squadra" : "Nuova squadra"}</div>
              {[["nome","Nome"],["indirizzo","Indirizzo"],["colori","Colori"],["note","Note"]].map(([f,l]) => (
                <div key={f}><label style={lbl}>{l}</label>
                  <input style={inp} type="text" value={editS[f] || ""} onChange={e => setEditS({ ...editS, [f]: e.target.value })} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <button style={saveBtn} disabled={saving} onClick={async () => {
                  setSaving(true);
                  const { id, ...f } = editS;
                  if (id) {
                    // Se il nome è cambiato, aggiorna anche la classifica
                    const vecchio = squadreHook.data.find(s => s.id === id);
                    if (vecchio && vecchio.nome !== f.nome) {
                      const vInClass = classificaHook.data.find(c => c.squadra === vecchio.nome);
                      if (vInClass) await classificaHook.update(vInClass.id, { squadra: f.nome });
                    }
                    await squadreHook.update(id, f);
                  } else {
                    // Nuova squadra → aggiungila anche in classifica con 0 punti
                    await squadreHook.upsert(f);
                    await classificaHook.upsert({ squadra: f.nome, g: 0, v: 0, p: 0, s: 0, gf: 0, gs: 0, pt: 0 });
                  }
                  setSaving(false);
                  setEditS(null);
                }}>{saving ? "…" : "Salva"}</button>
                <button style={cancelBtn} onClick={() => setEditS(null)}>Annulla</button>
                {editS.id && <button style={delBtn} onClick={async () => {
                  // Elimina anche dalla classifica
                  const inClass = classificaHook.data.find(c => c.squadra === editS.nome);
                  if (inClass) await classificaHook.remove(inClass.id);
                  await squadreHook.remove(editS.id);
                  setEditS(null);
                }}>Elimina</button>}
              </div>
            </div>
          )}
          <div style={styles.card}>
            <div style={styles.cardHeader}>SQUADRE
              <button style={{ background: COLORS.giallo, color: COLORS.bluDark, border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                onClick={() => setEditS({ nome: "", indirizzo: "", colori: "", note: "" })}>+ Aggiungi</button>
            </div>
            {squadreHook.loading ? <Spinner /> : squadreHook.data.map(s => (
              <div key={s.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{s.nome}</div>
                  <div style={{ fontSize: 12, color: COLORS.gray600 }}>{s.indirizzo}</div>
                  {s.colori && <div style={{ fontSize: 11, color: COLORS.gray400 }}>🎨 {s.colori}{s.note ? ` — ${s.note}` : ""}</div>}
                </div>
                <button style={{ background: "none", border: `1px solid ${COLORS.gray200}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }} onClick={() => setEditS({ ...s })}>✏️</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLASSIFICA */}
      {tab === "classifica" && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>GESTIONE CLASSIFICA</div>
          {classificaHook.loading ? <Spinner /> : [...classificaHook.data].sort((a, b) => b.pt - a.pt).map((c, i) => (
            <div key={c.id} style={{ padding: "10px 16px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: c.squadra === "USOB Bareggio" ? 800 : 400, color: COLORS.bluDark }}>{i + 1}. {c.squadra}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button style={{ background: COLORS.gray100, border: "none", borderRadius: 4, width: 28, height: 28, cursor: "pointer", fontSize: 14, fontWeight: 700 }}
                  onClick={() => classificaHook.update(c.id, { pt: Math.max(0, c.pt - 1) })}>−</button>
                <span style={{ fontWeight: 800, color: COLORS.blu, minWidth: 24, textAlign: "center" }}>{c.pt}</span>
                <button style={{ background: COLORS.giallo, border: "none", borderRadius: 4, width: 28, height: 28, cursor: "pointer", fontSize: 14, fontWeight: 700 }}
                  onClick={() => classificaHook.update(c.id, { pt: c.pt + 1 })}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────

export default function App() {
  const [section, setSection] = useState("home");
  const rosaHook = useTable("rosa", "numero");
  const partiteHook = useTable("partite", "data");
  const classificaHook = useTable("classifica", "pt");
  const squadreHook = useTable("squadre", "nome");
  const pasteHook = useTable("paste", "data");
  const globalLoading = rosaHook.loading || partiteHook.loading || classificaHook.loading;

  const navItems = [
    { id: "calendario", label: "Calendario" },
    { id: "analytics", label: "Analytics" },
    { id: "home", label: "Home", center: true },
    { id: "fun", label: "Fun" },
    { id: "area", label: "Staff" },
  ];

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>USOB</div>
          <div style={styles.headerTitle}>U.S.O.B. BAREGGIO</div>
        </div>
      </header>

      <main style={styles.content}>
        {section === "home" && <HomeSection rosa={rosaHook.data} partite={partiteHook.data} classifica={classificaHook.data} loading={globalLoading} />}
        {section === "calendario" && <CalendarioSection partite={partiteHook.data} classifica={classificaHook.data} loading={partiteHook.loading} />}
        {section === "analytics" && <AnalyticsSection rosa={rosaHook.data} classifica={classificaHook.data} loading={globalLoading} />}
        {section === "fun" && <FunSection rosa={rosaHook.data} partite={partiteHook.data} paste={pasteHook.data} loading={globalLoading || pasteHook.loading} />}
        {section === "area" && <AreaRiservataSection rosaHook={rosaHook} partiteHook={partiteHook} classificaHook={classificaHook} squadreHook={squadreHook} pasteHook={pasteHook} />}
      </main>

      <nav style={styles.nav}>
        {navItems.map(item => {
          if (item.center) return (
            <button key={item.id} onClick={() => setSection(item.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: "0 4px", marginTop: -22 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.giallo, border: `4px solid ${COLORS.white}`, boxShadow: "0 4px 14px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.bluDark }}>
                <NavIcon name="home" />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: section === item.id ? COLORS.blu : COLORS.gray400, marginTop: 4 }}>{item.label}</span>
            </button>
          );
          return (
            <button key={item.id} style={styles.navBtn(section === item.id)} onClick={() => setSection(item.id)}>
              <NavIcon name={item.id} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
