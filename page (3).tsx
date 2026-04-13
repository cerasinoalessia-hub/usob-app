import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function AnalyticsPage() {
  const [{ data: marcatori }, { data: classifica }, { data: presenze }] = await Promise.all([
    supabase.from("marcatori_view").select("*").order("gol", { ascending: false }),
    supabase.from("classifica").select("*").order("punti", { ascending: false }),
    supabase.from("presenze_view").select("*").order("ruolo").order("cognome"),
  ]);

  const ruoli = ["POR", "DIF", "CEN", "ATT"];
  const ruoloLabel: Record<string, string> = { POR: "Portieri", DIF: "Difensori", CEN: "Centrocampisti", ATT: "Attaccanti" };

  return (
    <div>
      {/* Marcatori */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Marcatori</h2>
        {(marcatori ?? []).length === 0 && <p className="text-sm text-gray-400">Nessun gol registrato</p>}
        {(marcatori ?? []).map((m: any, i: number) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <span className="text-xs font-bold text-gray-300 w-5">{i + 1}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{m.cognome} {m.nome}</p>
              <p className="text-xs text-gray-400">{m.ruolo}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-usob-yellow border border-yellow-400" />
              <span className="text-sm font-bold text-usob-blue">{m.gol}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Classifica */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Classifica</h2>
        {(classifica ?? []).map((r: any, i: number) => (
          <div
            key={i}
            className={`flex items-center gap-2 py-2.5 border-b border-gray-50 last:border-0 rounded-lg px-1 ${
              r.usob ? "bg-usob-yellow-light" : ""
            }`}
          >
            <span className={`text-xs font-bold w-5 text-center ${r.usob ? "text-usob-blue" : "text-gray-300"}`}>{i + 1}</span>
            <span className={`flex-1 text-sm ${r.usob ? "font-bold text-usob-blue" : "font-medium text-gray-800"}`}>{r.nome}</span>
            <span className={`text-sm font-bold ${r.usob ? "text-usob-blue" : "text-gray-600"}`}>{r.punti} pt</span>
          </div>
        ))}
      </div>

      {/* Presenze per ruolo */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Presenze</h2>
        {ruoli.map((ruolo) => {
          const gruppo = (presenze ?? []).filter((p: any) => p.ruolo === ruolo);
          if (gruppo.length === 0) return null;
          return (
            <div key={ruolo} className="mb-4">
              <p className="text-xs font-bold text-usob-blue mb-2">{ruoloLabel[ruolo]}</p>
              {gruppo.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-800">{p.cognome} {p.nome}</span>
                  <span className="text-xs font-semibold text-gray-500">{p.presenze} conv.</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
