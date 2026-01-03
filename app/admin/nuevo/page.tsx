"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";

// FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCloudArrowUp,
  faUserPen,
  faLayerGroup,
  faHeading,
  faCrown,
  faPaperPlane,
  faSpinner,
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

export default function AdminNuevoPost() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Redacción Habemus Info");
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
      return alert("Faltan datos obligatorios");
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
      alert("¡Noticia publicada!");
      router.push("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans pb-10">
      <nav className="bg-[#1e293b] p-4 md:p-6 sticky top-0 z-50 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-2">
          <h2 className="font-black uppercase tracking-tighter text-sm md:text-xl hidden md:block">
            Nueva Noticia
          </h2>
        </div>
        <Link
          href="/admin"
          className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> VOLVER AL PANEL
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto p-3 md:p-12">
        <div className="bg-white text-black rounded-2xl md:rounded-[3rem] p-5 md:p-16 shadow-2xl space-y-8">
          {/* UPLOAD IMAGEN */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <FontAwesomeIcon icon={faCloudArrowUp} /> Imagen de Portada
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
              className={`w-full h-48 md:h-96 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                uploading
                  ? "opacity-50 bg-slate-50"
                  : "hover:border-[#E30613] hover:bg-red-50"
              }`}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center text-slate-300">
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="text-4xl mb-2"
                  />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {uploading ? "Subiendo..." : "Click para subir foto"}
                  </p>
                </div>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faUserPen} /> Autor
              </label>
              <input
                type="text"
                className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-[#E30613] outline-none"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faLayerGroup} /> Sección
              </label>
              <select
                className="w-full p-4 bg-slate-50 rounded-xl font-black uppercase text-xs outline-none cursor-pointer border-2 border-transparent focus:border-[#E30613]"
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

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faHeading} /> Titular
            </label>
            <input
              type="text"
              placeholder="ESCRIBÍ EL TÍTULO AQUÍ..."
              className="w-full text-2xl md:text-5xl font-black uppercase tracking-tighter outline-none border-b-4 border-slate-100 focus:border-[#E30613] pb-4 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="h-[400px] mb-12">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-full rounded-xl overflow-hidden"
            />
          </div>

          <div
            className={`p-6 rounded-2xl flex items-center justify-between cursor-pointer border-2 transition-all ${
              isPremium
                ? "bg-yellow-50 border-yellow-400"
                : "bg-slate-50 border-transparent"
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
                Contenido Exclusivo
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
            onClick={guardarNoticia}
            disabled={loading || uploading}
            className="w-full bg-[#E30613] hover:bg-black text-white py-6 rounded-2xl font-black text-xl md:text-2xl uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-4"
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} />
            )}
            {loading ? "PUBLICANDO..." : "PUBLICAR NOTICIA"}
          </button>
        </div>
      </main>
    </div>
  );
}
