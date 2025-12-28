"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import 'react-quill-new/dist/quill.snow.css';
import Link from 'next/link';

// 1. Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 2. Cargamos el editor de forma dinámica (Compatible con React 19)
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ ...props }: any) => <RQ {...props} />;
  },
  { 
    ssr: false,
    loading: () => <div className="h-[400px] bg-gray-50 animate-pulse flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 font-sans">Cargando editor de texto...</div>
  }
) as any;

export default function AdminNuevoPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Politica');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const router = useRouter();

  // 3. PROTECCIÓN DE RUTA: Verificar si el admin está logueado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router]);

  // 4. Función para Cerrar Sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // 5. Guardar Noticia en Supabase
  const guardarNoticia = async () => {
    if (!title || !content) return alert("Por favor, completa el título y el contenido.");
    
    setLoading(true);
    
    // Generar slug amigable para URL (Ej: "Hola Mundo" -> "hola-mundo")
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    try {
      const { error } = await supabase
        .from('posts')
        .insert([
          { 
            title, 
            slug, 
            content, 
            category, 
            is_premium: isPremium 
          }
        ]);

      if (error) throw error;

      alert("¡Noticia publicada con éxito!");
      // Limpiar formulario
      setTitle('');
      setContent('');
      setIsPremium(false);

    } catch (error: any) {
      alert("Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return <div className="flex min-h-screen items-center justify-center font-sans">Verificando permisos...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 bg-white min-h-screen font-sans relative">
      
      {/* Botón de Salida */}
      <button 
        onClick={handleLogout}
        className="absolute top-6 right-6 text-gray-400 hover:text-red-500 text-sm font-bold transition-colors uppercase tracking-widest"
      >
        Cerrar Sesión Admin ✕
      </button>

      <header className="mb-12 border-b pb-8 flex justify-between items-end">
  <div>
    <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter">
      Redacción
    </h1>
    <p className="text-gray-500 mt-2 italic">Crea una noticia en El Informante</p>
  </div>
  
  <div className="flex gap-4">
    <Link href="/admin" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-1">
      ← Volver al Panel
    </Link>
  </div>
</header>
      
      <div className="grid grid-cols-1 gap-8">
        
        {/* TITULAR */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Titular de la noticia</label>
          <input 
            type="text" 
            placeholder="Escribe un título impactante..." 
            className="w-full p-4 border-b-2 border-gray-100 text-3xl font-bold focus:border-black outline-none transition-all placeholder:text-gray-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* AJUSTES: Categoría y Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase text-gray-500 tracking-wider">Sección / Categoría</label>
            <select 
              className="p-4 rounded-xl border-none shadow-sm bg-white font-bold text-gray-700 outline-none focus:ring-2 focus:ring-black cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Politica">Política</option>
              <option value="Economia">Economía</option>
              <option value="Deportes">Deportes</option>
              <option value="Tecnologia">Tecnología</option>
              <option value="Mundo">Mundo</option>
              <option value="Espectaculos">Espectáculos</option>
            </select>
          </div>

          <div className="flex items-center gap-4 md:pt-8">
            <input 
              type="checkbox" 
              id="premium"
              className="w-8 h-8 accent-black cursor-pointer shadow-sm"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
            />
            <label htmlFor="premium" className="font-black text-gray-800 cursor-pointer select-none text-lg uppercase tracking-tight">
               ¿Contenido Premium? ⭐
            </label>
          </div>
        </div>

        {/* EDITOR DE TEXTO */}
        <div className="flex flex-col gap-2 min-h-[550px]">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">Cuerpo del artículo (puedes incluir videos y links)</label>
          <div className="bg-white rounded-xl overflow-hidden shadow-inner border border-gray-100 h-full">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent}
              className="h-[450px]"
            />
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <button 
          onClick={guardarNoticia}
          disabled={loading}
          className={`w-full py-6 rounded-2xl font-black text-2xl uppercase tracking-[0.1em] shadow-xl transition-all transform active:scale-95 ${
            loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {loading ? "Procesando..." : "Publicar Noticia Ahora"}
        </button>
      </div>

      <footer className="mt-20 py-10 text-center border-t border-gray-50">
        <p className="text-xs text-gray-300 font-bold uppercase tracking-widest">Sistema de Gestión de Contenidos v1.0</p>
      </footer>
    </div>
  );
}