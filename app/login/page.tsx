"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Error de acceso: " + error.message);
      } else if (data.user) {
        // Usamos window.location para forzar una carga limpia de la sesión
        window.location.href = '/admin'; 
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
        <div className="max-w-md w-full mb-4">
  <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-2">
    ← Volver al Diario
  </Link>
</div>
      <form onSubmit={handleLogin} className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Admin</h1>
            <p className="text-gray-400 text-sm mt-2 font-bold uppercase tracking-widest">El Informante</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              required
              placeholder="tu@email.com" 
              className="w-full mt-1 p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Contraseña</label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full mt-1 p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-white shadow-lg transition-all transform active:scale-95 ${
              loading ? 'bg-gray-300' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {loading ? "Verificando..." : "Entrar al Panel"}
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-300 font-bold uppercase tracking-widest">Acceso Restringido</p>
      </form>
    </div>
  );
}