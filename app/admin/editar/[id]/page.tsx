"use client";
import { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import 'react-quill-new/dist/quill.snow.css';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const ReactQuill = dynamic(async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ ...props }: any) => <RQ {...props} />;
}, { ssr: false }) as any;

export default function EditarPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Obtenemos el ID de la URL
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Cargar los datos actuales de la noticia
  useEffect(() => {
    async function loadPost() {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setIsPremium(data.is_premium);
      }
      setLoading(false);
    }
    loadPost();
  }, [id]);

  // 2. Guardar cambios (Update)
  const actualizarNoticia = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('posts')
      .update({ title, content, category, is_premium: isPremium })
      .eq('id', id);

    if (error) alert("Error al actualizar: " + error.message);
    else {
      alert("¡Cambios guardados!");
      router.push('/admin'); // Volver al dashboard
    }
    setLoading(false);
  };

  if (loading) return <p className="p-10 text-center">Cargando editor...</p>;

  return (
    <div className="max-w-5xl mx-auto p-12 bg-white min-h-screen">
      <h1 className="text-3xl font-black mb-8 uppercase">Editar Noticia</h1>
      <div className="flex flex-col gap-6">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold p-4 border-b outline-none focus:border-blue-500"
        />
        <div className="flex gap-4 bg-gray-50 p-4 rounded-xl">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 rounded border">
                <option value="Politica">Política</option>
                <option value="Economia">Economía</option>
                <option value="Tecnologia">Tecnología</option>
            </select>
            <label className="flex items-center gap-2 font-bold">
                <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
                ¿Contenido Premium?
            </label>
        </div>
        <div className="h-[400px] mb-12">
          <ReactQuill theme="snow" value={content} onChange={setContent} className="h-full" />
        </div>
        <button 
          onClick={actualizarNoticia}
          className="bg-blue-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-700 transition"
        >
          Guardar Cambios
        </button>
        <button onClick={() => router.push('/admin')} className="text-gray-400 hover:underline">
          Cancelar y Volver
        </button>
      </div>
    </div>
  );
}