import { supabase } from "@/lib/supabase";
export const revalidate = 60;
export default async function FunPage() {
  const { data: paste } = await supabase.from("paste").select("*, giocatori(nome, cognome)").order("data_prevista");
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Lista paste</h2>
        <p className="text-xs text-gray-400 mb-4">Aggiornata automaticamente per gol e compleanni.</p>
        {(paste ?? []).length === 0 ? <p className="text-sm text-gray-400 text-center py-6">Nessuna pasta in programma</p> :
          (paste ?? []).map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e8eef8] flex items-center justify-center text-[#1a3a6b] font-bold text-sm flex-shrink-0">{i+1}</div>
                <div>
                  <p className="text-sm font-medium">{p.giocatori?.cognome} {p.giocatori?.nome}</p>
                  <p className="text-xs text-gray-400">{p.motivo}</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${p.tipo === "compleanno" ? "bg-pink-100 text-pink-700" : "bg-[#fef9e7] text-yellow-700"}`}>
                {p.tipo === "compleanno" ? "Compleanno" : "Gol"}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
