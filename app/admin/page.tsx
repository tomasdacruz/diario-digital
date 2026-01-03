"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
// IMPORTAR FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faSignOutAlt,
  faGear,
  faEye,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }

  async function eliminarPost(id: string) {
    if (confirm("¿Eliminar noticia?")) {
      await supabase.from("posts").delete().eq("id", id);
      fetchPosts();
    }
  }

  useEffect(() => {
    const checkAdmin = async () => {
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
      } else {
        fetchPosts();
      }
    };
    checkAdmin();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-black uppercase tracking-widest">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      <nav className="border-b border-slate-800 bg-[#1e293b] p-4 md:p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-black uppercase tracking-tighter">HABEMUS</span>
            <span className="bg-[#E30613] text-white px-2 py-1 font-black italic text-xl tracking-tighter transition-transform group-hover:scale-110">
              ADMIN
            </span>
          </Link>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
            className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <FontAwesomeIcon
                icon={faGear}
                className="text-[#E30613] text-2xl"
              />
              Gestión de Contenidos
            </h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">
              Panel de control editorial
            </p>
          </div>
          <Link
            href="/admin/nuevo"
            className="w-full md:w-auto bg-[#E30613] hover:bg-white hover:text-black text-white px-8 py-4 rounded-xl font-black transition-all shadow-xl shadow-red-900/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nueva Noticia
          </Link>
        </header>

        <div className="grid gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#1e293b] border border-slate-800 p-5 md:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-[#E30613] transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E30613]">
                    <FontAwesomeIcon icon={faNewspaper} className="mr-1" />
                    {post.category}
                  </span>
                  {post.is_premium && (
                    <span className="text-[9px] bg-yellow-500 text-black px-2 py-0.5 rounded font-black uppercase">
                      Premium
                    </span>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight line-clamp-1">
                  {post.title}
                </h3>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Link
                  href={`/post/${post.slug}`}
                  target="_blank"
                  className="flex-1 md:flex-none bg-slate-700 hover:bg-blue-600 p-3 px-4 rounded-xl transition text-center"
                  title="Ver noticia"
                >
                  <FontAwesomeIcon icon={faEye} />
                </Link>
                <Link
                  href={`/admin/editar/${post.id}`}
                  className="flex-1 md:flex-none bg-slate-700 hover:bg-green-600 p-3 px-4 rounded-xl transition text-center"
                  title="Editar"
                >
                  <FontAwesomeIcon icon={faPen} />
                </Link>
                <button
                  onClick={() => eliminarPost(post.id)}
                  className="flex-1 md:flex-none bg-slate-700 hover:bg-red-600 p-3 px-4 rounded-xl transition text-red-400 hover:text-white"
                  title="Eliminar"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
