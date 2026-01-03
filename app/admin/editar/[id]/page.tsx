"use client";
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";

// FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faImage,
  faUserPen,
  faLayerGroup,
  faHeading,
  faSave,
  faSpinner,
  faCrown,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

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
      alert("¡Cambios guardados!");
      router.push("/admin");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans pb-10">
      <nav className="bg-[#1e293b] p-4 md:p-6 sticky top-0 z-50 flex justify-between items-center text-white">
        <h2 className="font-black uppercase italic tracking-tighter">
          Editar Artículo
        </h2>
        <Link
          href="/admin"
          className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> CANCELAR
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto p-3 md:p-12 text-black">
        <div className="bg-white rounded-2xl md:rounded-[3rem] p-5 md:p-16 space-y-8 shadow-2xl">
          <div>
            <label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faImage} /> Reemplazar Imagen
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
              className="w-full h-48 md:h-80 border-4 border-dashed rounded-xl flex items-center justify-center cursor-pointer overflow-hidden relative group"
            >
              {imageUrl && (
                <img src={imageUrl} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <FontAwesomeIcon icon={faUpload} className="text-3xl" />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faUserPen} /> Autor
              </label>
              <input
                type="text"
                className="p-4 bg-slate-50 rounded-xl font-bold outline-none"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faLayerGroup} /> Categoría
              </label>
              <select
                className="p-4 bg-slate-50 rounded-xl font-black uppercase text-xs outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Politica">Política</option>
                <option value="Economia">Economía</option>
                <option value="Deportes">Deportes</option>
                <option value="Cultura">Cultura</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faHeading} /> Titular
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl md:text-5xl font-black uppercase outline-none border-b-4 focus:border-[#E30613] pb-2"
            />
          </div>

          <div className="h-[350px] md:h-[450px] mb-12">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-full rounded-xl overflow-hidden border"
            />
          </div>

          <div
            className={`p-6 rounded-2xl flex items-center justify-between cursor-pointer border-2 transition-all ${
              isPremium ? "bg-yellow-50 border-yellow-400" : "bg-slate-50"
            }`}
            onClick={() => setIsPremium(!isPremium)}
          >
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCrown}
                className={`${
                  isPremium ? "text-yellow-600" : "text-slate-300"
                } text-xl`}
              />
              <label className="font-black uppercase text-xs tracking-widest cursor-pointer">
                Contenido Premium
              </label>
            </div>
            <input
              type="checkbox"
              className="w-6 h-6 accent-yellow-600"
              checked={isPremium}
              readOnly
            />
          </div>

          <button
            onClick={actualizarNoticia}
            disabled={saving || uploading}
            className="w-full bg-black text-white py-6 rounded-2xl font-black text-xl md:text-2xl uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 hover:bg-[#E30613] transition-all"
          >
            {saving ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faSave} />
            )}
            {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          </button>
        </div>
      </main>
    </div>
  );
}
