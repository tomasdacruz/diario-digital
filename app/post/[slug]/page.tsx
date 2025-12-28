import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// En Next.js 15, 'params' es una Promesa, por eso usamos async/await para obtener el slug
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = await params;

  // Consultamos la base de datos usando .select().eq() que es el estándar
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post || error) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto p-6 font-serif min-h-screen bg-white">
      <header className="mb-8 mt-10">
        <div className="flex items-center gap-2 mb-4">
            <span className="text-red-600 font-bold uppercase text-sm tracking-widest">
            {post.category}
            </span>
            {post.is_premium && (
                <span className="bg-yellow-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">Premium</span>
            )}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mt-2 leading-tight text-gray-900">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 mt-8 text-gray-500 text-sm border-y py-4 border-gray-100 italic">
          <span>Por Redacción El Informante</span>
          <span>•</span>
          <span>{new Date(post.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </header>

      {/* Lógica de Paywall */}
      {post.is_premium ? (
        <div className="relative">
          {/* Mostramos un fragmento del texto */}
          <div 
            className="text-xl leading-relaxed text-gray-800 opacity-30 select-none pointer-events-none"
            style={{ maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)' }}
            dangerouslySetInnerHTML={{ __html: post.content.substring(0, 400) }} 
          />
          
          {/* El cartel de suscripción */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-black text-white p-8 md:p-12 rounded-3xl text-center shadow-2xl max-w-lg mx-4 border-b-8 border-yellow-500">
              <span className="text-4xl mb-4 block">🔒</span>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Contenido exclusivo para socios</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Esta noticia requiere una suscripción activa. Al suscribirte nos ayudas a mantener un periodismo libre y sin anuncios molestos.
              </p>
              <button className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 transition-all text-lg shadow-lg active:scale-95">
                SUSCRIBIRME CON MERCADO PAGO
              </button>
              <p className="mt-4 text-xs text-gray-500">Solo $2.500 ARS/mes (Cancela cuando quieras)</p>
            </div>
          </div>
        </div>
      ) : (
        // Contenido completo para noticias gratis
        <div 
          className="prose prose-lg max-w-none text-xl leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      )}

      <footer className="mt-20 pt-10 border-t border-gray-100 mb-20 text-center">
        <p className="text-gray-400 text-sm">© 2025 EL INFORMANTE. Todos los derechos reservados.</p>
      </footer>
    </article>
  );
}