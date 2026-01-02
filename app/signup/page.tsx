"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      alert(
        "¡Cuenta creada! Revisa tu email para confirmar (si activaste la confirmación)."
      );
      window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-black p-10 text-center">
          <h2 className="text-white font-black text-3xl tracking-tighter uppercase">
            Crear Cuenta
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
            Unite a Habemus Info
          </p>
        </div>
        <form onSubmit={handleSignUp} className="p-10 space-y-6">
          <input
            type="email"
            placeholder="Tu Email"
            required
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#E30613] font-bold"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Tu Contraseña"
            required
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#E30613] font-bold"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full py-5 rounded-2xl font-black text-white bg-[#E30613] hover:bg-black transition-all"
          >
            {loading ? "PROCESANDO..." : "REGISTRARME"}
          </button>
        </form>
        <div className="p-6 text-center border-t border-slate-50">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-400 hover:text-black uppercase tracking-widest"
          >
            ¿Ya tenés cuenta? Ingresá
          </Link>
        </div>
      </div>
    </div>
  );
}
