import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// 1. Conexión a Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  // 2. Traemos las noticias de la base de datos (las más nuevas primero)
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error cargando noticias:", error);
  }

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 font-serif bg-[#fdfcf8] min-h-screen text-black">
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR (Añadida ahora) */}
      <nav className="flex justify-between items-center py-2 border-b border-gray-200 mb-4 text-sm font-sans">
        <div className="flex gap-4">
          <span className="font-bold">Secciones:</span>
          <Link href="/" className="hover:underline">Inicio</Link>
          <Link href="/?cat=Politica" className="hover:underline">Política</Link>
          <Link href="/?cat=Tecnologia" className="hover:underline">Tecnología</Link>
        </div>
        
        {/* BOTÓN DE LOGIN */}
        <div>
          <Link 
            href="/login" 
            className="bg-black text-white px-4 py-1.5 rounded-full font-bold hover:bg-gray-800 transition-all text-xs uppercase tracking-widest"
          >
            Ingresar / Admin
          </Link>
        </div>
      </nav>

      {/* CABECERA (Modificada un poco para que encaje mejor) */}
      <header className="border-b-8 border-double border-black mb-10 pb-6 text-center">
        <div className="flex justify-between items-end mb-4 text-[10px] md:text-xs font-bold uppercase tracking-widest pb-2">
          <span>{new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="hidden md:block text-red-600">Periodismo Digital Independiente</span>
          <span>Buenos Aires, Argentina</span>
        </div>
        <Link href="/">
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none hover:opacity-80 transition-opacity">
            EL INFORMANTE
          </h1>
        </Link>
        <p className="mt-4 text-gray-600 italic text-xl">"La verdad, sin filtros"</p>
      </header>

      {/* CUERPO DEL DIARIO */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* COLUMNA PRINCIPAL (Noticias) - Ocupa 8 de 12 columnas */}
        <section className="md:col-span-8 space-y-12">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="group border-b border-gray-200 pb-10 last:border-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  {post.is_premium && (
                    <span className="bg-yellow-400 text-black px-2 py-0.5 text-xs font-bold uppercase flex items-center gap-1">
                      ⭐ Premium
                    </span>
                  )}
                </div>

                {/* LINK A LA NOTICIA COMPLETA */}
                <Link href={`/post/${post.slug}`}>
                  <h2 className="text-4xl font-bold leading-tight group-hover:text-blue-800 transition-colors cursor-pointer decoration-blue-800 decoration-2">
                    {post.title}
                  </h2>
                </Link>

                <div className="mt-4 flex flex-col md:flex-row gap-6">
                  {/* Si tuvieses una imagen_url la pondríamos aquí */}
                  <div className="flex-1">
                    <div 
                      className="text-gray-700 text-lg leading-relaxed line-clamp-3 mb-4"
                      dangerouslySetInnerHTML={{ __html: post.content }} 
                    />
                    <Link href={`/post/${post.slug}`} className="text-blue-600 font-bold hover:underline">
                      Continuar leyendo →
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
               <p className="text-gray-400 text-xl">Todavía no hay noticias publicadas.</p>
               <Link href="/admin/nuevo" className="text-blue-500 underline mt-2 block">Ir al panel de admin</Link>
            </div>
          )}
        </section>

        {/* COLUMNA LATERAL (Sidebar) - Ocupa 4 de 12 columnas */}
        <aside className="md:col-span-4 space-y-10">
          
          {/* Espacio para Publicidad / Google Ads */}
          <div className="bg-gray-100 border border-gray-300 p-4 text-center">
            <span className="text-[10px] text-gray-400 uppercase block mb-2 font-sans">Publicidad</span>
            <div className="h-64 flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-300 text-gray-400 font-sans italic">
              Espacio para Google Ads
            </div>
          </div>

          {/* Sección "Lo más leído" */}
          <div className="bg-white p-6 border-t-4 border-black shadow-sm">
            <h3 className="font-black text-xl uppercase mb-6 border-b border-black pb-2">Destacados</h3>
            <div className="space-y-6">
              {/* Aquí podrías poner las noticias con más views en el futuro */}
              <p className="text-sm text-gray-500 italic">No hay noticias destacadas aún.</p>
            </div>
          </div>

        </aside>

      </div>

      <footer className="mt-20 py-10 border-t-2 border-black text-center text-sm text-gray-500 font-sans">
        <p>© 2025 EL INFORMANTE - Buenos Aires, Argentina</p>
      </footer>

    </main>
  );
}