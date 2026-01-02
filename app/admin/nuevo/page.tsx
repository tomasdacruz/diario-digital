"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import 'react-quill-new/dist/quill.snow.css';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Configuración de Quill para que use <p> y no <span>
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const ReactQuill = dynamic(async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ ...props }: any) => <RQ {...props} />;
}, { ssr: false }) as any;

export default function AdminNuevoPost() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Politica');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); });
  }, [router]);

  const handleUploadImage = async (e: any) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const filePath = `noticias/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (error: any) { alert(error.message); } finally { setUploading(false); }
  };

  const guardarNoticia = async () => {
    if (!title || !content || !imageUrl) return alert("Completa título, contenido e imagen");
    setLoading(true);
    const cleanedContent = content
    .replace(/&nbsp;/g, ' ')      // Cambia la entidad HTML
    .replace(/\u00A0/g, ' ')     // Cambia el carácter unicode que Quill a veces mete
    .replace(/<span[^>]*>/g, '') // OPCIONAL: Borra los <span> para que no ensucien
    .replace(/<\/span>/g, '');
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const { error } = await supabase.from('posts').insert([{ title, slug, content, category, is_premium: isPremium, image_url: imageUrl }]);
    if (error) alert(error.message);
    else { alert("¡Publicado!"); router.push('/admin'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans pb-20">
      <nav className="bg-[#1e293b] border-b border-slate-800 p-6 flex justify-between items-center">
        <h2 className="font-black uppercase italic tracking-tighter">Redacción Central</h2>
        <Link href="/admin" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">← Volver</Link>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="bg-white text-black rounded-[3rem] p-8 md:p-16 shadow-2xl space-y-10">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Imagen de Portada</label>
            <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" id="upload" />
            <label htmlFor="upload" className="w-full h-64 border-4 border-dashed rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-[#E30613] overflow-hidden">
              {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <span className="text-slate-400 font-bold">{uploading ? "Subiendo..." : "Subir foto"}</span>}
            </label>
          </div>

          <input type="text" placeholder="TÍTULO IMPACTANTE..." className="w-full text-4xl md:text-6xl font-black uppercase tracking-tighter outline-none border-b-8 border-slate-50 focus:border-[#E30613] transition-all pb-6" value={title} onChange={(e)=>setTitle(e.target.value)} />

          <div className="grid grid-cols-2 gap-8">
            <select className="p-5 bg-slate-50 rounded-2xl font-black uppercase tracking-widest text-xs outline-none" value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option value="Politica">Política</option>
              <option value="Sociedad">Sociedad</option>
              <option value="Deportes">Deportes</option>
            </select>
            <div className={`flex items-center gap-4 rounded-2xl px-8 cursor-pointer border-2 ${isPremium ? 'bg-yellow-50 border-yellow-400' : 'bg-slate-50'}`} onClick={()=>setIsPremium(!isPremium)}>
              <input type="checkbox" className="w-6 h-6 accent-[#E30613]" checked={isPremium} readOnly />
              <label className="font-black uppercase text-xs tracking-widest">Premium ⭐</label>
            </div>
          </div>

          <div className="h-[500px] mb-20">
            <ReactQuill theme="snow" modules={modules} value={content} onChange={setContent} className="h-full rounded-2xl overflow-hidden" />
          </div>

          <button onClick={guardarNoticia} disabled={loading || uploading} className="w-full bg-[#E30613] hover:bg-black text-white py-8 rounded-[2rem] font-black text-3xl uppercase tracking-widest transition-all">
            {loading ? "PROCESANDO..." : "PUBLICAR AHORA"}
          </button>
        </div>
      </main>
    </div>
  );
}