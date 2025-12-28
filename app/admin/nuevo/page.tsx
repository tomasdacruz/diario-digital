"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import 'react-quill-new/dist/quill.snow.css';

// Cargamos el editor de forma dinámica para evitar errores de Next.js
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new"); // <--- Aquí cambiamos a 'react-quill-new'
    return ({ ...props }: any) => <RQ {...props} />;
  },
  { 
    ssr: false,
    loading: () => <div className="h-[400px] bg-gray-50 animate-pulse flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400">Cargando editor de texto...</div>
  }
) as any;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminNuevoPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isPremium, setIsPremium] = useState(false);

  const guardarNoticia = async () => {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { title, slug, content, category, is_premium: isPremium }
      ]);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("¡Noticia publicada con éxito!");
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Crear Nueva Noticia</h1>
      
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Título de la noticia" 
          className="w-full p-3 border border-gray-300 rounded text-2xl font-bold outline-none focus:border-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex gap-4">
          <select 
            className="p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Politica">Política</option>
            <option value="Economia">Economía</option>
            <option value="Deportes">Deportes</option>
            <option value="Tecnologia">Tecnología</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
            />
            ¿Contenido Premium? (Solo suscriptores)
          </label>
        </div>

        {/* El Editor de Texto */}
        <div className="h-96 mb-12">
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent}
            className="h-full"
            placeholder="Escribe el cuerpo de la noticia aquí... puedes pegar links de videos o imágenes"
          />
        </div>

        <button 
          onClick={guardarNoticia}
          className="bg-black text-white px-8 py-3 rounded font-bold hover:bg-gray-800 transition"
        >
          Publicar Noticia
        </button>
      </div>
    </div>
  );
}