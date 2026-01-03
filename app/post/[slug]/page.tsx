import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import NoticiaContenedor from "@/components/NoticiaContenedor"; // Importamos el nuevo componente

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
    title: post ? `${post.title} | INFO DIARIO` : "Cargando noticia...",
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

  return (
    <div className="bg-white min-h-screen font-sans text-black overflow-x-hidden">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 md:px-8 pb-20">
        <header className="py-12 md:py-20">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="bg-[#E30613] text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
              {post.category}
            </span>
            {post.is_premium && (
              <span className="bg-yellow-400 text-black px-2 py-1 text-[10px] font-black uppercase tracking-tighter rounded">
                ⭐ PREMIUM
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-7xl font-black leading-[1.1] md:leading-[0.9] tracking-tighter uppercase mb-8 break-words">
            {post.title}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-t border-gray-100 pt-6">
            <span className="text-black italic">
              Por {post.author || "Redacción"}
            </span>
            <span className="hidden md:block text-gray-200">|</span>
            <span suppressHydrationWarning>
              {new Date(post.created_at).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        <AdBanner dataAdSlot="0000000003" />

        {post.image_url && (
          <img
            src={post.image_url}
            alt=""
            className="w-full h-auto object-cover rounded-[2.5rem] shadow-2xl mb-12"
          />
        )}

        {/* Invocamos al componente de cliente que maneja la sesión */}
        <NoticiaContenedor post={post} />

        <Footer />
      </main>
    </div>
  );
}
