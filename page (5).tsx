"use client";
import { useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";

const PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "usob2025";

export default function AdminPage() {
  const [input, setInput] = useState("");
  const [logged, setLogged] = useState(false);
  const [error, setError] = useState(false);

  function tryLogin() {
    if (input === PASSWORD) {
      setLogged(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!logged) {
    return (
      <div className="flex flex-col items-center justify-center pt-16 px-4">
        <div className="w-16 h-16 rounded-full bg-usob-blue-light flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth={2} className="w-8 h-8">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-gray-800 mb-1">Area Riservata</h1>
        <p className="text-sm text-gray-400 mb-6 text-center">Inserisci la password per accedere</p>
        <input
          type="password"
          placeholder="Password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && tryLogin()}
          className="w-full max-w-xs border border-gray-200 rounded-xl px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:border-usob-blue mb-3"
        />
        {error && <p className="text-sm text-red-500 mb-2">Password errata</p>}
        <button
          onClick={tryLogin}
          className="w-full max-w-xs bg-usob-blue text-white rounded-xl py-3 font-medium text-sm"
        >
          Entra
        </button>
      </div>
    );
  }

  return <AdminDashboard />;
}
