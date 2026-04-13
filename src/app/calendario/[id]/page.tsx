import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
export const revalidate = 60;
export default async function MatchPage({ params }: { params: { id: string } }) {
  const { data: p } = await supabase.from("partite").select("*, squadre(nome, indirizzo, colori, note)").eq("id", params.id).single();
  if (!p) notFound();
  const { data: classifica } = await supabase.from("classifica").select("*").order("punti", { ascending: false });
  const posUSO = (classifica ?? []).findIndex((r: any) => r.usob) + 1;
  const posAvv = (classifica ?? []).findIndex((r: any) => r.nome === p.squadre?.nome) + 1;
  const title = p.casa ? `USOB vs ${p.squadre?.nome}` : `${p.squadre?.nome} vs USOB`;
  return (
    <div>
      <Link href="/calendario" className="text-sm text-[#2255a0] mb-4 block">← Calendario</Link>
      <div className="bg-[#1a3a6b] text-white rounded-2xl p-5 mb-4 text-center">
        <p className="text-xs text-blue-200 mb-1">{new Date(p.data).toLocaleDateString("it-IT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
        <h1 className="font-bold text-lg mb-3">{title}</h1>
        {p.gol_casa !== null ? <div className="text-4xl font-bold text-[#f5c518]">{p.gol_casa} – {p.gol_trasferta}</div> : <div className="text-2xl text-white/50">da giocare</div>}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Info partita</h2>
        {p.squadre?.indirizzo && <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-sm text-gray-500">Indirizzo</span><span className="text-sm font-medium">{p.squadre.indirizzo}</span></div>}
        {posUSO > 0 && <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-sm text-gray-500">USOB in classifica</span><span className="text-sm font-bold text-[#1a3a6b]">{posUSO}°</span></div>}
        {posAvv > 0 && <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-sm text-gray-500">{p.squadre?.nome} in classifica</span><span className="text-sm font-bold">{posAvv}°</span></div>}
        {p.squadre?.colori && <div className="flex justify-between py-2"><span className="text-sm text-gray-500">Colori avversario</span><span className="text-sm font-medium">{p.squadre.colori}</span></div>}
      </div>
    </div>
  );
}
