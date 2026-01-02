"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil

  const categories = [
    { name: 'Política', slug: 'Politica' },
    { name: 'Economía', slug: 'Economia' },
    { name: 'Sociedad', slug: 'Sociedad' },
    { name: 'Deportes', slug: 'Deportes' },
    { name: 'Cultura', slug: 'Cultura' },
    { name: 'Tecnología', slug: 'Tecnologia' },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsLogged(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLogged(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-2xl font-sans">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase">HABEMUS</span>
          <span className="bg-[#E30613] text-white px-2 py-1 font-black italic text-2xl md:text-3xl tracking-tighter group-hover:scale-105 transition-transform">
            INFO
          </span>
        </Link>

        {/* MENÚ DESKTOP (Oculto en móvil) */}
        <div className="hidden lg:flex gap-6 items-center font-black text-[10px] tracking-widest uppercase">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/?cat=${cat.slug}`} className="hover:text-[#E30613] transition-colors">
              {cat.name}
            </Link>
          ))}
          <div className="h-4 w-[1px] bg-white/20 mx-2"></div>
          {isLogged ? (
            <Link href="/admin" className="bg-white text-black px-4 py-2 rounded hover:bg-[#E30613] hover:text-white transition-all">
              Admin ⚙️
            </Link>
          ) : (
            <Link href="/login" className="border border-white/20 px-4 py-2 rounded hover:bg-white hover:text-black transition-all">
              Ingresar
            </Link>
          )}
        </div>

        {/* BOTÓN HAMBURGUESA (Solo en móvil) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 z-50 transition-all active:scale-90"
          aria-label="Menú"
        >
          {isOpen ? (
            // Icono X (Cerrar)
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Icono Hamburguesa (Abrir)
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* MENÚ MÓVIL (OVERLAY) */}
      <div className={`
        fixed inset-0 bg-black text-white transition-all duration-300 transform lg:hidden
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
      `}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 font-black uppercase tracking-[0.2em] text-xl">
          {/* Categorías en móvil */}
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/?cat=${cat.slug}`} 
              onClick={() => setIsOpen(false)}
              className="hover:text-[#E30613] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          
          <div className="w-20 h-[2px] bg-[#E30613]/50 my-4"></div>

          {/* Botón Admin/Login en móvil */}
          {isLogged ? (
            <Link 
              href="/admin" 
              onClick={() => setIsOpen(false)}
              className="bg-white text-black px-10 py-4 rounded-xl text-sm"
            >
              PANEL ADMIN ⚙️
            </Link>
          ) : (
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="border-2 border-[#E30613] px-10 py-4 rounded-xl text-sm text-[#E30613]"
            >
              INGRESAR
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}