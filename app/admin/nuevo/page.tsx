"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ ...props }: any) => <RQ {...props} />;
  },
  { ssr: false }
) as any;

export default function AdminNuevoPost() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Redacción InfoDiario");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Politica");
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
    });
  }, [router]);

  const handleUploadImage = async (e: any) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const filePath = `noticias/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("images").getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const guardarNoticia = async () => {
    if (!title || !content || !imageUrl)
      return alert("Completa todos los campos");
    setLoading(true);
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const { error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          slug,
          content,
          category,
          is_premium: isPremium,
          image_url: imageUrl,
          author: author,
        },
      ]);
    if (error) alert(error.message);
    else {
      alert("¡Publicado!");
      router.push("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans pb-10">
      <nav className="bg-[#1e293b] p-4 md:p-6 sticky top-0 z-50 flex justify-between items-center shadow-xl">
        <h2 className="font-black uppercase italic tracking-tighter text-lg md:text-xl">
          Redactor
        </h2>
        <Link
          href="/admin"
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
        >
          ← Panel
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto p-3 md:p-12">
        {/* Contenedor principal: Padding reducido en móvil (p-5) */}
        <div className="bg-white text-black rounded-2xl md:rounded-[3rem] p-5 md:p-16 shadow-2xl space-y-6 md:space-y-10">
          {/* SECCIÓN IMAGEN */}
          <div>
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-1">
              Imagen de Portada
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              className="hidden"
              id="upload"
            />
            <label
              htmlFor="upload"
              className={`w-full h-48 md:h-80 border-4 border-dashed rounded-xl md:rounded-[2.5rem] flex items-center justify-center cursor-pointer transition-all ${
                uploading ? "opacity-50" : "hover:border-[#E30613]"
              }`}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  className="w-full h-full object-cover rounded-lg md:rounded-[2.3rem]"
                />
              ) : (
                <span className="font-black uppercase text-[10px] text-slate-300 tracking-widest">
                  Subir Imagen
                </span>
              )}
            </label>
          </div>

          {/* INPUTS AUTOR Y CATEGORÍA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 block">
                Autor
              </label>
              <input
                type="text"
                className="w-full p-3 md:p-5 bg-slate-50 rounded-xl md:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#E30613] text-sm md:text-base"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 block">
                Sección
              </label>
              <select
                className="w-full p-3 md:p-5 bg-slate-50 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs outline-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Politica">Política</option>
                <option value="Economia">Economía</option>
                <option value="Sociedad">Sociedad</option>
                <option value="Deportes">Deportes</option>
                <option value="Cultura">Cultura</option>
                <option value="Tecnologia">Tecnología</option>
              </select>
            </div>
          </div>

          {/* TITULAR */}
          <input
            type="text"
            placeholder="TITULAR DE LA NOTICIA..."
            className="w-full text-2xl md:text-5xl font-black uppercase tracking-tighter outline-none border-b-4 md:border-b-8 border-slate-50 focus:border-[#E30613] pb-2 md:pb-6"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* EDITOR (Altura reducida en móvil) */}
          <div className="h-[350px] md:h-[450px] mb-12 md:mb-20">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-full rounded-xl md:rounded-2xl overflow-hidden"
            />
          </div>

          {/* CHECKBOX PREMIUM MÁS COMPACTO */}
          <div
            className={`p-4 md:p-8 rounded-xl md:rounded-3xl flex items-center gap-4 cursor-pointer border-2 transition-all ${
              isPremium
                ? "bg-yellow-50 border-yellow-400"
                : "bg-slate-50 border-transparent"
            }`}
            onClick={() => setIsPremium(!isPremium)}
          >
            <input
              type="checkbox"
              className="w-5 h-5 md:w-6 md:h-6 accent-[#E30613]"
              checked={isPremium}
              readOnly
            />
            <label className="font-black uppercase text-[10px] md:text-xs tracking-widest cursor-pointer">
              Contenido Premium ⭐
            </label>
          </div>

          {/* BOTÓN PUBLICAR */}
          <button
            onClick={guardarNoticia}
            disabled={loading || uploading}
            className="w-full py-5 md:py-8 rounded-xl md:rounded-[2rem] font-black text-xl md:text-3xl uppercase tracking-widest transition-all shadow-xl active:scale-95 bg-[#E30613] hover:bg-black text-white"
          >
            {loading ? "PROCESANDO..." : "PUBLICAR"}
          </button>
        </div>
      </main>
    </div>
  );
}
