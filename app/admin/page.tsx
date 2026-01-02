"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
      else {
        const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (data) setPosts(data);
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  async function eliminarPost(id: string) {
    if (confirm("¿Eliminar noticia?")) {
      await supabase.from('posts').delete().eq('id', id);
      setPosts(posts.filter(p => p.id !== id));
    }
  }

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white uppercase font-black tracking-widest">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      <nav className="border-b border-slate-800 bg-[#1e293b] p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xl font-black italic tracking-tighter">
          <Link href="/">INFO ADMIN</Link>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cerrar Sesión ✕</button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Gestión de Noticias</h1>
          <Link href="/admin/nuevo" className="bg-[#E30613] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/20 hover:bg-white hover:text-black transition-all">+ NUEVA NOTICIA</Link>
        </header>
        <div className="grid gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-[#1e293b] border border-slate-800 p-6 rounded-[1.5rem] flex justify-between items-center hover:border-[#E30613] transition-all">
              <div className="flex-1"><span className="text-[10px] font-black uppercase tracking-widest text-[#E30613]">{post.category}</span>
              <h3 className="text-xl font-bold uppercase tracking-tight line-clamp-1">{post.title}</h3></div>
              <div className="flex gap-3"><Link href={`/admin/editar/${post.id}`} className="bg-slate-700 p-4 rounded-xl">✏️</Link>
              <button onClick={() => eliminarPost(post.id)} className="bg-slate-700 p-4 rounded-xl text-red-400">🗑️</button></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}