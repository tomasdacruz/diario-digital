import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = await params;

  // Traemos la noticia desde Supabase
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post || error) {
    notFound();
  }

  // FUNCIÓN DE LIMPIEZA DE TEXTO (ARREGLA EL ERROR DE LAS PALABRAS CORTADAS)
  const limpiarContenido = (html: string) => {
    return html
      .replace(/&nbsp;/g, ' ')      // Reemplaza espacio HTML por espacio normal
      .replace(/\u00A0/g, ' ')     // Reemplaza espacio Unicode por espacio normal
      .replace(/<span[^>]*>/g, '') // Elimina etiquetas span que ensucian
      .replace(/<\/span>/g, '');   // Elimina cierre de span
  };

  return (
    <div className="bg-white min-h-screen font-sans text-black overflow-x-hidden">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 md:px-8 pb-20">
        
        {/* ENCABEZADO DE LA NOTICIA */}
        <header className="py-10 md:py-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-[#E30613] text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
              {post.category}
            </span>
            {post.is_premium && (
              <span className="bg-yellow-400 text-black px-2 py-1 text-[10px] font-black uppercase tracking-tighter rounded shadow-sm">
                ⭐ CONTENIDO SOCIOS
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-7xl font-black leading-[1.1] md:leading-[0.9] tracking-tighter uppercase mb-8 text-slate-900 break-words">
            {post.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-t border-gray-100 pt-6">
            <span className="text-black italic">Por Redacción InfoDiario</span>
            <span className="hidden md:block text-gray-200">|</span>
            <span>{new Date(post.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </header>

        {/* IMAGEN DE PORTADA */}
        {post.image_url && (
          <div className="mb-12 -mx-4 md:-mx-0">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-auto object-cover md:rounded-[2.5rem] shadow-2xl"
            />
          </div>
        )}

        {/* CUERPO DE LA NOTICIA / LÓGICA DE SUSCRIPCIÓN */}
        <section className="relative w-full block">
          {post.is_premium ? (
            <div className="relative">
              {/* Vista previa desenfocada (también limpiamos el texto aquí) */}
              <div 
                className="noticia-cuerpo text-lg md:text-2xl text-slate-800 opacity-20 select-none pointer-events-none mb-10"
                style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)' }}
                dangerouslySetInnerHTML={{ __html: limpiarContenido(post.content.substring(0, 450)) }} 
              />
              
              {/* CARTEL DE SUSCRIPCIÓN (Estilo Moderno) */}
              <div className="absolute top-0 left-0 w-full flex justify-center pt-5">
                <div className="bg-[#0f172a] text-white p-8 md:p-16 rounded-[3rem] text-center shadow-2xl border-b-8 border-[#E30613] max-w-2xl w-full mx-2">
                  <span className="text-5xl mb-6 block">🔒</span>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                    Información exclusiva
                  </h2>
                  <p className="text-slate-400 text-lg mb-10 font-medium">
                    Esta noticia es solo para suscriptores. Apoyá el periodismo independiente.
                  </p>
                  
                  <button className="w-full bg-[#E30613] hover:bg-white hover:text-black text-white font-black py-6 rounded-2xl transition-all text-xl uppercase tracking-widest shadow-xl active:scale-95">
                    Suscribirme ahora
                  </button>
                  
                  <div className="mt-8">
                    <Link href="/login" className="text-xs font-bold underline text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                        ¿Ya sos socio? Iniciar sesión
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CONTENIDO PARA NOTICIAS GRATUITAS (Limpiamos los &nbsp; al renderizar) */
            <div className="w-full block">
              <div 
                className="noticia-cuerpo text-slate-900" 
                dangerouslySetInnerHTML={{ __html: limpiarContenido(post.content) }} 
              />
            </div>
          )}
        </section>

        <footer className="mt-24 pt-10 border-t border-gray-100 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-6">
                <span className="bg-black text-white px-2 py-1 font-black italic text-xl tracking-tighter">INFO</span>
                <span className="font-black text-xl tracking-tighter uppercase">DIARIO</span>
            </div>
            <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em] text-center">
                © 2026 EL INFORMANTE DIGITAL - TODOS LOS DERECHOS RESERVADOS
            </p>
        </footer>
      </main>
    </div>
  );
}