import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("posts")
    .select("title")
    .eq("slug", slug)
    .single();

  return {
    title: post ? `${post.title} | Habemus Info` : "Cargando noticia...",
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) notFound();

  const limpiarContenido = (html: string) => {
    return html
      .replace(/&nbsp;/g, " ")
      .replace(/\u00A0/g, " ")
      .replace(/<span[^>]*>/g, "")
      .replace(/<\/span>/g, "");
  };

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLogged = !!session;

  return (
    <div className="bg-white min-h-screen font-sans text-black overflow-x-hidden">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 md:px-8 pb-20">
        {/* HEADER */}
        <header className="py-12 md:py-20">
          <span className="bg-[#E30613] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-7xl font-black leading-[1.1] md:leading-[0.9] tracking-tighter uppercase mb-8 break-words">
            {post.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-t border-gray-100 pt-6">
            <span className="text-black italic">
              Por {post.author || "Redacción InfoDiario"}
            </span>
            <span className="hidden md:block text-gray-200">|</span>
            <span>
              {new Date(post.created_at).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* ANUNCIO SUPERIOR */}
        <AdBanner dataAdSlot="0000000003" />

        {/* IMAGEN PRINCIPAL */}
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-auto rounded-[2.5rem] shadow-2xl mb-12"
          />
        )}

        {/* BOTONES DE COMPARTIR */}
        <div className="flex flex-wrap gap-3 mb-10 border-y border-gray-100 py-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-full mb-2 md:w-auto md:mb-0 md:mr-4 self-center">
            Compartir:
          </span>
          <a
            href={`https://api.whatsapp.com/send?text=${post.title} - ${process.env.NEXT_PUBLIC_URL}/post/${post.slug}`}
            target="_blank"
            className="bg-[#25D366] text-white px-4 py-2 rounded-lg font-bold text-xs hover:opacity-80 transition"
          >
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${post.title}&url=${process.env.NEXT_PUBLIC_URL}/post/${post.slug}`}
            target="_blank"
            className="bg-black text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#E30613] transition"
          >
            Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_URL}/post/${post.slug}`}
            target="_blank"
            className="bg-[#1877F2] text-white px-4 py-2 rounded-lg font-bold text-xs hover:opacity-80 transition"
          >
            Facebook
          </a>
        </div>

        {/* CONTENIDO Y LÓGICA DE BLOQUEO */}
        <section className="relative w-full block">
          {post.is_premium && !isLogged ? (
            /* --- CASO PREMIUM (Bloqueado) --- */
            <div className="relative">
              <div
                className="noticia-cuerpo opacity-10 select-none pointer-events-none mb-10 h-40 overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: limpiarContenido(post.content.substring(0, 300)),
                }}
              />
              <div className="absolute top-0 left-0 w-full flex justify-center pt-5">
                <div className="bg-[#0f172a] text-white p-8 md:p-16 rounded-[3rem] text-center shadow-2xl border-b-8 border-[#E30613] max-w-2xl w-full mx-2">
                  <span className="text-5xl mb-6 block">🔒</span>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                    Contenido exclusivo
                  </h2>
                  <p className="text-slate-400 text-lg mb-10">
                    Crea una cuenta gratuita para seguir leyendo esta noticia.
                  </p>
                  <Link
                    href="/signup"
                    className="inline-block w-full bg-[#E30613] hover:bg-white hover:text-black text-white font-black py-6 rounded-2xl transition-all text-xl uppercase tracking-widest shadow-xl text-center"
                  >
                    CREAR MI CUENTA GRATIS
                  </Link>
                  <Link
                    href="/login"
                    className="mt-8 block text-xs font-bold underline text-slate-500 hover:text-white uppercase tracking-widest"
                  >
                    ¿Ya sos socio? Iniciar sesión
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* --- CASO GRATIS O LOGUEADO (Desbloqueado) --- */
            <div className="w-full block">
              <div
                className="noticia-cuerpo text-xl text-gray-800 break-words"
                dangerouslySetInnerHTML={{
                  __html: limpiarContenido(post.content),
                }}
              />

              {/* ANUNCIO INFERIOR (Ahora sí está dentro del flujo correcto) */}
              <div className="mt-12 pt-10 border-t border-gray-100">
                <AdBanner dataAdSlot="0000000004" />
              </div>
            </div>
          )}
        </section>

        <Footer />
      </main>
    </div>
  );
}
