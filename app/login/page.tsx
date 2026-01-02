"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirigir si ya hay una sesión activa al entrar a la página
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = "/";
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Acceso denegado: " + error.message);
      } else if (data.user) {
        // 1. Buscamos el rol en la tabla profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        // 2. Redirección inteligente según el rol
        if (profile?.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      alert("Error inesperado en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 font-sans">
      {/* BOTÓN VOLVER DISCRETO */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"
        >
          ← Volver al portal
        </Link>
      </div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl shadow-red-900/20 border border-white/10">
        {/* CABECERA CON LOGO ROJO */}
        <div className="bg-black p-10 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-white font-black text-3xl tracking-tighter uppercase">
              HABEMUS
            </span>
            <span className="bg-[#E30613] text-white px-3 py-1 font-black italic text-3xl tracking-tighter">
              INFO
            </span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            Ingreso a tu cuenta
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="ejemplo@correo.com"
              className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#E30613] focus:bg-white transition-all font-bold text-slate-700"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#E30613] focus:bg-white transition-all font-bold text-slate-700"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-white text-lg uppercase tracking-widest transition-all transform active:scale-95 shadow-xl ${
              loading
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-[#E30613] hover:bg-black"
            }`}
          >
            {loading ? "VERIFICANDO..." : "INGRESAR"}
          </button>
        </form>

        {/* LINK A REGISTRO */}
        <div className="bg-slate-50 p-8 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">
            ¿No tenés cuenta aún?
          </p>
          <Link
            href="/signup"
            className="text-[#E30613] font-black uppercase tracking-tighter text-lg hover:underline transition-all"
          >
            Registrate gratis ahora
          </Link>
        </div>
      </div>

      <footer className="mt-12 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
        © 2026 Habemus Info
      </footer>
    </div>
  );
}
