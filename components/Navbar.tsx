"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsLogged(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setIsLogged(!!session));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-2xl font-sans">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase">HABEMUS</span>
          <span className="bg-[#E30613] text-white px-2 py-1 font-black italic text-2xl md:text-3xl tracking-tighter">INFO</span>
        </Link>
        <div className="flex gap-4 items-center font-black text-[10px] tracking-widest uppercase">
          {isLogged ? (
            <Link href="/admin" className="bg-white text-black px-4 py-2 rounded hover:bg-[#E30613] hover:text-white transition-all">ADMIN ⚙️</Link>
          ) : (
            <Link href="/login" className="border border-white/20 px-4 py-2 rounded hover:bg-white hover:text-black transition-all">INGRESAR</Link>
          )}
        </div>
      </div>
    </nav>
  );
}