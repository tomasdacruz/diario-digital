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

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    const { error } = await supabase
      .from("posts")
      .update({
        title,
        content,
        category,
        is_premium: isPremium,
        image_url: imageUrl,
        author,
      })
      .eq("id", id);
    if (error) alert(error.message);
    else {
      alert("¡Actualizado!");
      router.push("/admin");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-black uppercase tracking-widest">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans pb-10">
      <nav className="bg-[#1e293b] p-4 md:p-6 sticky top-0 z-50 flex justify-between items-center text-white">
        <h2 className="font-black uppercase italic tracking-tighter">Editar</h2>
        <Link
          href="/admin"
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
        >
          ← Volver
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto p-3 md:p-12">
        <div className="bg-white rounded-2xl md:rounded-[3rem] p-5 md:p-16 space-y-6 text-black">
          <div>
            <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest">
              Cambiar Imagen
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
              className="w-full h-48 md:h-80 border-4 border-dashed rounded-xl flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-[#E30613]"
            >
              {imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-300 font-bold uppercase text-[10px]">
                  Subir foto
                </span>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <input
              type="text"
              placeholder="Autor"
              className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-[#E30613]"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <select
              className="w-full p-4 bg-slate-50 rounded-xl font-black uppercase text-[10px] outline-none cursor-pointer"
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

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl md:text-5xl font-black uppercase outline-none border-b-4 focus:border-[#E30613] pb-2"
          />

          <div className="h-[350px] md:h-[450px] mb-12 md:mb-20">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-full rounded-xl overflow-hidden border"
            />
          </div>

          <button
            onClick={actualizarNoticia}
            disabled={saving || uploading}
            className="w-full bg-[#E30613] text-white py-5 md:py-8 rounded-xl md:rounded-[2rem] font-black text-xl md:text-2xl uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          </button>
        </div>
      </main>
    </div>
  );
}
