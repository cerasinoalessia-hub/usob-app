"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
type Tab = "rosa" | "partite" | "squadre" | "classifica";
export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("rosa");
  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(["rosa","partite","squadre","classifica"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${tab===t?"bg-[#1a3a6b] text-white":"bg-white text-gray-500 border border-gray-200"}`}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>
      {tab==="rosa"&&<RosaTab/>}
      {tab==="partite"&&<PartiteTab/>}
      {tab==="squadre"&&<SquadreTab/>}
      {tab==="classifica"&&<ClassificaTab/>}
    </div>
  );
}
function RosaTab() {
  const [players,setPlayers]=useState<any[]>([]);
  const [form,setForm]=useState({numero:"",nome:"",cognome:"",ruolo:"ATT",data_nascita:""});
  async function load(){const{data}=await supabase.from("giocatori").select("*").order("numero");setPlayers(data??[]);}
  useEffect(()=>{load();},[]);
  async function add(){
    if(!form.numero||!form.cognome)return;
    await supabase.from("giocatori").insert({numero:parseInt(form.numero),nome:form.nome,cognome:form.cognome,ruolo:form.ruolo,data_nascita:form.data_nascita||null});
    setForm({numero:"",nome:"",cognome:"",ruolo:"ATT",data_nascita:""});load();
  }
  async function remove(id:number){if(!confirm("Rimuovere?"))return;await supabase.from("giocatori").delete().eq("id",id);load();}
  return(
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Aggiungi giocatore</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input placeholder="N°" type="number" value={form.numero} onChange={(e)=>setForm({...form,numero:e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
          <select value={form.ruolo} onChange={(e)=>setForm({...form,ruolo:e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            {["POR","DIF","CEN","ATT"].map(r=><option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input placeholder="Nome" value={form.nome} onChange={(e)=>setForm({...form,nome:e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
          <input placeholder="Cognome" value={form.cognome} onChange={(e)=>setForm({...form,cognome:e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
        </div>
        <input type="date" value={form.data_nascita} onChange={(e)=>setForm({...form,data_nascita:e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full mb-2"/>
        <button onClick={add} className="w-full bg-[#1a3a6b] text-white rounded-lg py-2 text-sm font-medium">+ Aggiungi</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        {players.map((p)=>(
          <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className="w-7 h-7 rounded-full bg-[#1a3a6b] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">{p.numero}</div>
            <div className="flex-1"><p className="text-sm font-medium">{p.cognome} {p.nome}</p>{p.data_nascita&&<p className="text-xs text-gray-400">{new Date(p.data_nascita).toLocaleDateString("it-IT")}</p>}</div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8eef8] text-[#1a3a6b]">{p.ruolo}</span>
            <button onClick={()=>remove(p.id)} className="text-red-400 text-xs px-2">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
function PartiteTab() {
  const [partite,setPartite]=useState<any[]>([]);
  const [squadre,setSquadre]=useState<any[]>([]);
  const [giocatori,setGiocatori]=useState<any[]>([]);
  const [selected,setSelected]=useState<any>(null);
  const [gol,setGol]=useState({casa:"",trasferta:""});
  const [marcatori,setMarcatori]=useState<{giocatore_id:string;gol:string}[]>([]);
  const [convocati,setConvocati]=useState<string[]>([]);
  const [newP,setNewP]=useState({data:"",squadra_id:"",casa:true});
  async function load(){
    const[p,s,g]=await Promise.all([
      supabase.from("partite").select("*, squadre(nome)").order("data",{ascending:false}),
      supabase.from("squadre").select("id,nome").order("nome"),
      supabase.from("giocatori").select("id,numero,cognome,nome").order("numero"),
    ]);
    setPartite(p.data??[]);setSquadre(s.data??[]);setGiocatori(g.data??[]);
  }
  useEffect(()=>{load();},[]);
  async function addPartita(){
    if(!newP.data||!newP.squadra_id)return;
    await supabase.from("partite").insert({data:newP.data,squadra_id:parseInt(newP.squadra_id),casa:newP.casa});
    setNewP({data:"",squadra_id:"",casa:true});load();
  }
  async function saveResult(){
    if(!selected)return;
    await supabase.from("partite").update({gol_casa:parseInt(gol.casa),gol_trasferta:parseInt(gol.trasferta)}).eq("id",selected.id);
    await supabase.from("gol").delete().eq("partita_id",selected.id);
    for(const m of marcatori){if(m.giocatore_id&&parseInt(m.gol)>0){for(let i=0;i<parseInt(m.gol);i++)await supabase.from("gol").insert({partita_id:selected.id,giocatore_id:parseInt(m.giocatore_id)});}}
    await supabase.from("convocazioni").delete().eq("partita_id",selected.id);
    for(const gid of convocati)await supabase.from("convocazioni").insert({partita_id:selected.id,giocatore_id:parseInt(gid)});
    setSelected(null);load();
  }
  if(selected)return(
    <div>
      <button onClick={()=>setSelected(null)} className="text-sm text-[#1a3a6b] mb-4 block">← Indietro</button>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <h3 className="font-semibold text-gray-800 mb-1">{selected.squadre?.nome}</h3>
        <p className="text-xs text-gray-400 mb-4">{new Date(selected.data).toLocaleDateString("it-IT")}</p>
        <div className="flex gap-3 mb-4">
          <div className="flex-1"><label className="text-xs text-gray-400 block mb-1">Gol USOB</label><input type="number" value={gol.casa} onChange={(e)=>setGol({...gol,casa:e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full text-center text-lg font-bold"/></div>
          <div className="flex-1"><label className="text-xs text-gray-400 block mb-1">Gol {selected.squadre?.nome}</label><input type="number" value={gol.trasferta} onChange={(e)=>setGol({...gol,trasferta:e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full text-center text-lg font-bold"/></div>
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Marcatori</p>
        {marcatori.map((m,i)=>(
          <div key={i} className="flex gap-2 mb-2">
            <select value={m.giocatore_id} onChange={(e)=>{const n=[...marcatori];n[i].giocatore_id=e.target.value;setMarcatori(n);}} className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm">
              <option value="">Seleziona</option>
              {giocatori.map((g)=><option key={g.id} value={g.id}>{g.numero} – {g.cognome}</option>)}
            </select>
            <input type="number" min="1" max="10" value={m.gol} onChange={(e)=>{const n=[...marcatori];n[i].gol=e.target.value;setMarcatori(n);}} className="w-12 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center"/>
            <button onClick={()=>setMarcatori(marcatori.filter((_,j)=>j!==i))} className="text-red-400 text-xs px-1">✕</button>
          </div>
        ))}
        <button onClick={()=>setMarcatori([...marcatori,{giocatore_id:"",gol:"1"}])} className="text-xs text-[#1a3a6b] mb-4 block">+ Aggiungi marcatore</button>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Convocati</p>
        <div className="grid grid-cols-2 gap-1 mb-4">
          {giocatori.map((g)=>(
            <label key={g.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={convocati.includes(String(g.id))} onChange={(e)=>setConvocati(e.target.checked?[...convocati,String(g.id)]:convocati.filter(id=>id!==String(g.id)))}/>
              {g.numero} – {g.cognome}
            </label>
          ))}
        </div>
        <button onClick={saveResult} className="w-full bg-[#1a3a6b] text-white rounded-lg py-2.5 text-sm font-medium">Salva risultato</button>
      </div>
    </div>
  );
  return(
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Aggiungi partita</h3>
        <input type="date" value={newP.data} onChange={(e)=>setNewP({...newP,data:e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full mb-2"/>
        <select value={newP.squadra_id} onChange={(e)=>setNewP({...newP,squadra_id:e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full mb-2">
          <option value="">Seleziona avversario</option>
          {squadre.map((s)=><option key={s.id} value={s.id}>{s.nome}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm mb-3 cursor-pointer">
          <input type="checkbox" checked={newP.casa} onChange={(e)=>setNewP({...newP,casa:e.target.checked})}/> Partita in casa
        </label>
        <button onClick={addPartita} className="w-full bg-[#1a3a6b] text-white rounded-lg py-2 text-sm font-medium">+ Aggiungi partita</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        {partite.map((p)=>(
          <button key={p.id} onClick={()=>{setSelected(p);setGol({casa:p.gol_casa??"",trasferta:p.gol_trasferta??""});setMarcatori([{giocatore_id:"",gol:"1"}]);setConvocati([]);}}
            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 w-full text-left">
            <div><p className="text-xs text-gray-400">{new Date(p.data).toLocaleDateString("it-IT")}</p><p className="text-sm font-medium">vs {p.squadre?.nome}</p></div>
            <span className="text-sm text-[#1a3a6b] font-medium">{p.gol_casa!==null?`${p.gol_casa}–${p.gol_trasferta}`:"Inserisci →"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function SquadreTab(){
  const [squadre,setSquadre]=useState<any[]>([]);
  const [form,setForm]=useState({nome:"",indirizzo:"",colori:"",note:""});
  async function load(){const{data}=await supabase.from("squadre").select("*").order("nome");setSquadre(data??[]);}
  useEffect(()=>{load();},[]);
  async function add(){if(!form.nome)return;await supabase.from("squadre").insert(form);setForm({nome:"",indirizzo:"",colori:"",note:""});load();}
  return(
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Aggiungi squadra</h3>
        {[{key:"nome",label:"Nome squadra"},{key:"indirizzo",label:"Indirizzo campo"},{key:"colori",label:"Colori maglia"},{key:"note",label:"Note"}].map(({key,label})=>(
          <input key={key} placeholder={label} value={(form as any)[key]} onChange={(e)=>setForm({...form,[key]:e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full mb-2"/>
        ))}
        <button onClick={add} className="w-full bg-[#1a3a6b] text-white rounded-lg py-2 text-sm font-medium">+ Aggiungi</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        {squadre.map((s)=>(
          <div key={s.id} className="py-3 border-b border-gray-50 last:border-0">
            <p className="text-sm font-medium">{s.nome}</p>
            {s.indirizzo&&<p className="text-xs text-gray-400">{s.indirizzo}</p>}
            {s.colori&&<p className="text-xs text-gray-400">Colori: {s.colori}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
function ClassificaTab(){
  const [classifica,setClassifica]=useState<any[]>([]);
  async function load(){const{data}=await supabase.from("classifica").select("*").order("punti",{ascending:false});setClassifica(data??[]);}
  useEffect(()=>{load();},[]);
  async function updatePunti(id:number,delta:number){
    const r=classifica.find((r)=>r.id===id);if(!r)return;
    const newPunti=Math.max(0,r.punti+delta);
    await supabase.from("classifica").update({punti:newPunti}).eq("id",id);
    setClassifica(classifica.map((r)=>r.id===id?{...r,punti:newPunti}:r));
  }
  return(
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      {classifica.map((r,i)=>(
        <div key={r.id} className={`flex items-center gap-2 py-2.5 border-b border-gray-50 last:border-0 ${r.usob?"bg-[#fef9e7] rounded-lg px-2 -mx-2":""}`}>
          <span className="text-xs font-bold text-gray-300 w-5 text-center">{i+1}</span>
          <span className={`flex-1 text-sm ${r.usob?"font-bold text-[#1a3a6b]":"text-gray-800"}`}>{r.nome}</span>
          <div className="flex items-center gap-2">
            <button onClick={()=>updatePunti(r.id,-1)} className="w-7 h-7 border border-gray-200 rounded-full text-gray-500 text-sm">−</button>
            <span className="text-sm font-bold text-[#1a3a6b] w-6 text-center">{r.punti}</span>
            <button onClick={()=>updatePunti(r.id,1)} className="w-7 h-7 border border-gray-200 rounded-full text-gray-500 text-sm">+</button>
          </div>
        </div>
      ))}
    </div>
  );
}
