import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 60;

async function getData() {
  const [partite, giocatori, marcatori, paste] = await Promise.all([
    supabase
      .from("partite")
      .select("*, squadra_avversaria")
      .gte("data", new Date().toISOString().split("T")[0])
      .order("data", { ascending: true })
      .limit(3),
    supabase
      .from("giocatori")
      .select("numero, nome, cognome, ruolo")
      .order("numero", { ascending: true })
      .limit(5),
    supabase
      .from("marcatori_view")
      .select("*")
      .order("gol", { ascending: false })
      .limit(5),
    supabase
      .from("paste")
      .select("*, giocatori(nome, cognome)")
      .order("data_prevista", { ascending: true })
      .limit(4),
  ]);
  return {
    partite: partite.data ?? [],
    giocatori: giocatori.data ?? [],
    marcatori: marcatori.data ?? [],
    paste: paste.data ?? [],
  };
}

function Card({ title, children, href }: { title: string; children: React.ReactNode; href?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
        {href && <Link href={href} className="text-xs text-usob-blue-mid font-medium">Vedi tutti →</Link>}
      </div>
      {children}
    </div>
  );
}

function RuoloBadge({ ruolo }: { ruolo: string }) {
  const map: Record<string, string> = {
    POR: "bg-purple-100 text-purple-700",
    DIF: "bg-blue-100 text-blue-700",
    CEN: "bg-green-100 text-green-700",
    ATT: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[ruolo] ?? "bg-gray-100 text-gray-600"}`}>
      {ruolo}
    </span>
  );
}

export default async function HomePage() {
  const { partite, giocatori, marcatori, paste } = await getData();

  return (
    <div>
      {/* Prossimi impegni */}
      <Card title="Prossimi impegni" href="/calendario">
        {partite.length === 0 ? (
          <p className="text-sm text-gray-400">Nessuna partita programmata</p>
        ) : (
          partite.map((p: any) => (
            <Link key={p.id} href={`/calendario/${p.id}`} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-xs text-gray-400">{new Date(p.data).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}</p>
                <p className="text-sm font-medium text-gray-800">USOB vs {p.squadra_avversaria}</p>
              </div>
              <span className="text-sm font-semibold text-gray-400">–</span>
            </Link>
          ))
        )}
      </Card>

      {/* Rosa squadra */}
      <Card title="Rosa squadra" href="/analytics">
        {giocatori.map((g: any) => (
          <div key={g.numero} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="w-7 h-7 rounded-full bg-usob-blue flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {g.numero}
            </div>
            <span className="flex-1 text-sm font-medium text-gray-800">{g.cognome} {g.nome}</span>
            <RuoloBadge ruolo={g.ruolo} />
          </div>
        ))}
      </Card>

      {/* Marcatori */}
      <Card title="Marcatori" href="/analytics">
        {marcatori.length === 0 ? (
          <p className="text-sm text-gray-400">Nessun gol ancora</p>
        ) : (
          marcatori.map((m: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{m.cognome} {m.nome}</p>
                <p className="text-xs text-gray-400">{m.ruolo}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-usob-yellow border border-yellow-400" />
                <span className="text-sm font-semibold text-usob-blue">{m.gol}</span>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Paste */}
      <Card title="Prossime paste" href="/fun">
        {paste.length === 0 ? (
          <p className="text-sm text-gray-400">Lista paste vuota</p>
        ) : (
          paste.map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {p.giocatori?.cognome} {p.giocatori?.nome}
                </p>
                <p className="text-xs text-gray-400">{p.motivo}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                p.tipo === "compleanno" ? "bg-pink-100 text-pink-700" : "bg-usob-yellow-light text-yellow-700"
              }`}>
                {p.tipo === "compleanno" ? "🎂 Compleanno" : "⚽ Gol"}
              </span>
            </div>
          ))
        )}
      </Card>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/usobbareggio"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-usob-blue text-white rounded-2xl py-3 font-medium text-sm"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none" />
        </svg>
        Segui @usobbareggio su Instagram
      </a>
    </div>
  );
}
