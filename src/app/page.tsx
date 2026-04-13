import { supabase } from "@/lib/supabase";
import Link from "next/link";
export const revalidate = 60;
function Card({ title, children, href }: { title: string; children: React.ReactNode; href?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
        {href && <Link href={href} className="text-xs text-[#2255a0] font-medium">Vedi tutti →</Link>}
      </div>
      {children}
    </div>
  );
}
export default async function HomePage() {
  const [{ data: partite }, { data: giocatori }, { data: marcatori }, { data: paste }] = await Promise.all([
    supabase.from("partite").select("*, squadre(nome)").gte("data", new Date().toISOString().split("T")[0]).order("data").limit(3),
    supabase.from("giocatori").select("numero, nome, cognome, ruolo").order("numero").limit(5),
    supabase.from("marcatori_view").select("*").order("gol", { ascending: false }).limit(5),
    supabase.from("paste").select("*, giocatori(nome, cognome)").order("data_prevista").limit(4),
  ]);
  return (
    <div>
      <Card title="Prossimi impegni" href="/calendario">
        {(partite ?? []).length === 0 ? <p className="text-sm text-gray-400">Nessuna partita programmata</p> :
          (partite ?? []).map((p: any) => (
            <Link key={p.id} href={`/calendario/${p.id}`} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-xs text-gray-400">{new Date(p.data).toLocaleDateString("it-IT")}</p>
                <p className="text-sm font-medium text-gray-800">USOB vs {p.squadre?.nome}</p>
              </div>
              <span className="text-sm text-gray-400">–</span>
            </Link>
          ))}
      </Card>
      <Card title="Rosa squadra" href="/analytics">
        {(giocatori ?? []).map((g: any) => (
          <div key={g.numero} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="w-7 h-7 rounded-full bg-[#1a3a6b] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">{g.numero}</div>
            <span className="flex-1 text-sm font-medium text-gray-800">{g.cognome} {g.nome}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8eef8] text-[#1a3a6b]">{g.ruolo}</span>
          </div>
        ))}
      </Card>
      <Card title="Marcatori" href="/analytics">
        {(marcatori ?? []).length === 0 ? <p className="text-sm text-gray-400">Nessun gol ancora</p> :
          (marcatori ?? []).map((m: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium">{m.cognome} {m.nome}</p>
                <p className="text-xs text-gray-400">{m.ruolo}</p>
              </div>
              <span className="text-sm font-bold text-[#1a3a6b]">{m.gol} gol</span>
            </div>
          ))}
      </Card>
      <Card title="Prossime paste" href="/fun">
        {(paste ?? []).length === 0 ? <p className="text-sm text-gray-400">Lista vuota</p> :
          (paste ?? []).map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <p className="text-sm font-medium">{p.giocatori?.cognome} {p.giocatori?.nome}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.tipo === "compleanno" ? "bg-pink-100 text-pink-700" : "bg-[#fef9e7] text-yellow-700"}`}>
                {p.tipo === "compleanno" ? "Compleanno" : "Gol"}
              </span>
            </div>
          ))}
      </Card>
      <a href="https://www.instagram.com/usobbareggio" target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center w-full bg-[#1a3a6b] text-white rounded-2xl py-3 font-medium text-sm">
        Segui @usobbareggio su Instagram
      </a>
    </div>
  );
}
