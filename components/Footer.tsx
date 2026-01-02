"use client";
import Link from 'next/link';

export default function Footer() {
  const categories = [
    { name: 'Política', slug: 'Politica' },
    { name: 'Economía', slug: 'Economia' },
    { name: 'Sociedad', slug: 'Sociedad' },
    { name: 'Deportes', slug: 'Deportes' },
    { name: 'Cultura', slug: 'Cultura' },
    { name: 'Tecnología', slug: 'Tecnologia' },
  ];

  return (
    <footer className="mt-24 pt-10 border-t border-gray-100 flex flex-col items-center pb-20">
      {/* LOGO INFO DIARIO */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <span className="font-black text-xl tracking-tighter uppercase text-black">
          HABEMUS
        </span>
        <span className="bg-black text-white px-2 py-1 font-black italic text-xl tracking-tighter group-hover:bg-[#E30613] transition-colors">
          INFO
        </span>
      </Link>

      {/* MENÚ DE CATEGORÍAS EN EL FOOTER */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 px-4">
        {categories.map((cat) => (
          <Link 
            key={cat.slug} 
            href={`/?cat=${cat.slug}`}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#E30613] transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* LINKS DE GESTIÓN (OPCIONAL/DISCRETO) */}
      <div className="mb-10">
        <Link href="/admin" className="text-[9px] font-bold text-gray-300 hover:text-black uppercase tracking-[0.2em] border border-gray-100 px-3 py-1 rounded">
          Acceso Redacción
        </Link>
      </div>

      {/* TEXTO LEGAL */}
      <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em] text-center px-4 leading-loose">
        © 2026 HABEMUS INFO - TODOS LOS DERECHOS RESERVADOS
      </p>
    </footer>
  );
}