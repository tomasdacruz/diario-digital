import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await supabase.from('posts').select('*').eq('slug', slug).single();

  if (!post) notFound();

  const limpiarContenido = (html: string) => {
    return html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ').replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
  };

  return (
    <div className="bg-white min-h-screen font-sans text-black overflow-x-hidden">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 md:px-8 pb-20">
        <header className="py-12 md:py-20">
          <span className="bg-[#E30613] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-6 inline-block">{post.category}</span>
          <h1 className="text-4xl md:text-7xl font-black leading-[1.1] md:leading-[0.9] tracking-tighter uppercase mb-8 break-words">{post.title}</h1>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-t border-gray-100 pt-6">
            <span className="text-black italic">Por {post.author || 'Redacción InfoDiario'}</span>
            <span className="hidden md:block text-gray-200">|</span>
            <span>{new Date(post.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </header>

        {post.image_url && <img src={post.image_url} className="w-full h-auto rounded-[2.5rem] shadow-2xl mb-12" />}

        <section className="relative w-full block">
          {post.is_premium ? (
            <div className="relative">
              <div className="text-lg opacity-10 select-none pointer-events-none mb-10 overflow-hidden h-40" dangerouslySetInnerHTML={{ __html: limpiarContenido(post.content.substring(0, 300)) }} />
              <div className="bg-[#0f172a] text-white p-10 md:p-20 rounded-[3.5rem] text-center border-b-[12px] border-[#E30613] shadow-2xl">
                <span className="text-5xl mb-6 block">🔒</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 italic">Contenido Reservado</h2>
                <button className="w-full bg-[#E30613] text-white font-black py-6 rounded-2xl text-xl uppercase tracking-widest shadow-xl">Suscribirme ahora</button>
              </div>
            </div>
          ) : (
            <div className="noticia-cuerpo text-xl text-gray-800 break-words" dangerouslySetInnerHTML={{ __html: limpiarContenido(post.content) }} />
          )}
        </section>
        <Footer />
      </main>
    </div>
  );
}