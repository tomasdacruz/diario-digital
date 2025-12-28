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
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }

  async function eliminarPost(id: string) {
    if (confirm("¿Estás seguro de que quieres eliminar esta noticia? No se puede deshacer.")) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) alert("Error al eliminar");
      else fetchPosts(); // Recargar lista
    }
  }

  if (loading) return <p className="p-10 text-center font-serif text-2xl">Cargando noticias...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 font-sans">
      <header className="flex justify-between items-center mb-10 border-b pb-6">
  <div className="flex items-center gap-4">
    <h1 className="text-4xl font-black uppercase tracking-tighter">Panel de Gestión</h1>
    {/* Botón para ver el sitio público */}
    <Link 
      href="/" 
      className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors border border-gray-200 px-3 py-1 rounded-lg"
    >
      Ver Sitio Público ↗
    </Link>
  </div>

  <Link href="/admin/nuevo" className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition">
    + Nueva Noticia
  </Link>
</header>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 uppercase text-[10px] font-black text-gray-400">Título</th>
              <th className="p-4 uppercase text-[10px] font-black text-gray-400">Categoría</th>
              <th className="p-4 uppercase text-[10px] font-black text-gray-400 text-center">Premium</th>
              <th className="p-4 uppercase text-[10px] font-black text-gray-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-800">{post.title}</td>
                <td className="p-4 text-sm text-gray-500">{post.category}</td>
                <td className="p-4 text-center">{post.is_premium ? '⭐' : '—'}</td>
                <td className="p-4 text-right space-x-2">
                  <Link 
                    href={`/admin/editar/${post.id}`}
                    className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => eliminarPost(post.id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}