"use client";
import { useState, useEffect, use } from "react";
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

export default function EditarPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // ESTADOS (Asegúrate de que todos estén aquí)
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(""); // Faltaba este
  const [imageUrl, setImageUrl] = useState(""); // Faltaba este
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadPostAndCheckAdmin() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        window.location.href = "/";
        return;
      }

      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setTitle(data.title);
        setImageUrl(data.image_url || "");
        setAuthor(data.author || "");
        setContent(data.content);
        setCategory(data.category);
        setIsPremium(data.is_premium);
      }
      setLoading(false);
    }
    loadPostAndCheckAdmin();
  }, [id]);

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
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const actualizarNoticia = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("posts")
      .update({
        title,
        content,
        category,
        is_premium: isPremium,
        image_url: imageUrl,
        author: author,
      })
      .eq("id", id);

    if (error) alert(error.message);
    else {
      alert("¡Noticia actualizada!");
      router.push("/admin");
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans pb-20">
      <nav className="bg-[#1e293b] p-6 flex justify-between items-center text-white">
        <h2 className="font-black uppercase italic">Editar Artículo</h2>
        <Link
          href="/admin"
          className="text-[10px] font-black text-slate-400 uppercase"
        >
          ← Volver
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto p-12">
        <div className="bg-white rounded-[3rem] p-16 space-y-10 text-black">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">
              Imagen de Portada
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              className="hidden"
              id="edit-upload"
            />
            <label
              htmlFor="edit-upload"
              className="w-full h-64 border-4 border-dashed rounded-[2rem] flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-300">Subir foto</span>
              )}
            </label>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <input
              type="text"
              placeholder="Autor"
              className="p-5 bg-slate-50 rounded-2xl font-bold outline-none"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <select
              className="p-5 bg-slate-50 rounded-2xl font-black uppercase text-xs"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Politica">Política</option>
              <option value="Economia">Economía</option>
              <option value="Deportes">Deportes</option>
              <option value="Cultura">Cultura</option>
            </select>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-5xl font-black uppercase outline-none border-b-4 focus:border-[#E30613] pb-4"
          />

          <div className="h-[400px] mb-20">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-full rounded-2xl overflow-hidden"
            />
          </div>

          <button
            onClick={actualizarNoticia}
            disabled={loading || uploading}
            className="w-full bg-[#E30613] text-white py-6 rounded-[2rem] font-black text-2xl uppercase tracking-widest shadow-xl"
          >
            {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          </button>
        </div>
      </main>
    </div>
  );
}
