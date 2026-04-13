import { supabase } from "@/lib/supabase";
import Link from "next/link";
export const revalidate = 60;
export default async function CalendarioPage() {
  const { data: partite } = await supabase.from("partite").select("*, squadre(nome, indirizzo)").order("data", { ascending: false });
  const today = new Date().toISOString().split("T")[0];
  const fatte = (partite ?? []).filter((p: any) => p.data < today);
  const future = (partite ?? []).filter((p: any) => p.data >= today);
  function MatchRow({ p }: { p: any }) {
    const label = p.casa ? `USOB vs ${p.squadre?.nome}` : `${p.squadre?.nome} vs USOB`;
    const hasFinalScore = p.gol_casa !== null && p.gol_trasferta !== null;
    return (
      <Link href={`/calendario/${p.id}`} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
        <div>
          <p className="text-xs text-gray-400">{new Date(p.data).toLocaleDateString("it-IT", { weekday: "short", day: "2-digit", month: "short" })}</p>
          <p className="text-sm font-medium text-gray-800">{label}</p>
        </div>
        {hasFinalScore ? <span className="text-sm font-bold text-[#1a3a6b]">{p.gol_casa} – {p.gol_trasferta}</span> : <span className="text-sm text-gray-300">–</span>}
      </Link>
    );
  }
  return (
    <div>
      {future.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Da giocare</h2>
          {future.map((p: any) => <MatchRow key={p.id} p={p} />)}
        </div>
      )}
      {fatte.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Partite giocate</h2>
          {fatte.map((p: any) => <MatchRow key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
