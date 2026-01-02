import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const revalidate = 0;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function Home({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;

  let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
  if (cat) query = query.eq('category', cat);

  const { data: posts } = await query;

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-20 text-center">
           <div>
             <h2 className="text-3xl font-black uppercase">No hay noticias en {cat || 'esta sección'}</h2>
             <Link href="/" className="inline-block mt-8 bg-[#E30613] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest">Volver al Inicio</Link>
           </div>
        </div>
        <Footer />
      </div>
    );
  }

  const mainPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-black pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        {cat && <h2 className="text-2xl font-black uppercase mb-8 border-l-8 border-[#E30613] pl-4">Sección: {cat}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <section className="md:col-span-8">
            <Link href={`/post/${mainPost.slug}`} className="group relative block bg-black overflow-hidden rounded-[2.5rem] shadow-2xl min-h-[450px] md:min-h-[600px]">
              {mainPost.image_url && <img src={mainPost.image_url} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
                <span className="bg-[#E30613] text-white px-3 py-1 text-[10px] font-black uppercase mb-4 w-fit tracking-widest">{mainPost.category}</span>
                <h2 className="text-4xl md:text-7xl font-black text-white leading-[1] md:leading-[0.9] tracking-tighter uppercase break-words">{mainPost.title}</h2>
              </div>
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {otherPosts.map(post => (
                <Link key={post.id} href={`/post/${post.slug}`} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all">
                  <div className="aspect-video overflow-hidden">{post.image_url && <img src={post.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}</div>
                  <div className="p-8">
                    <span className="text-[#E30613] text-[10px] font-black uppercase tracking-widest mb-2 block">{post.category}</span>
                    <h3 className="text-2xl font-black leading-tight tracking-tighter uppercase group-hover:text-[#E30613] transition">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <aside className="md:col-span-4">
            <div className="bg-white p-8 rounded-[2.5rem] border-t-8 border-[#E30613] shadow-xl sticky top-24">
              <h3 className="font-black text-3xl mb-8 italic uppercase tracking-tighter border-b border-gray-100 pb-4">Lo más leído</h3>
              {posts.slice(0, 5).map((post, i) => (
                <Link key={post.id} href={`/post/${post.slug}`} className="flex gap-4 group mb-8 items-start last:mb-0">
                  <span className="text-4xl font-black text-gray-100 italic leading-none">{i + 1}</span>
                  <p className="font-black text-sm uppercase group-hover:text-[#E30613] transition">{post.title}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}