"use client";
import Link from 'next/link';

export default function Footer() {

    const socialLinks = [
      {
        name: "Instagram",
        url: "https://instagram.com/tu_diario",
        icon: (
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        ),
      },
      {
        name: "X",
        url: "https://twitter.com/tu_diario",
        icon: (
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        ),
      },
      {
        name: "Facebook",
        url: "https://facebook.com/tu_diario",
        icon: (
          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
        ),
      },
    ];
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
      
      <div className="flex flex-col items-center mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
          Seguinos en redes
        </p>
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              className="bg-slate-100 p-3 rounded-full hover:bg-[#E30613] hover:text-white transition-all text-black"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                {link.icon}
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* TEXTO LEGAL */}
      <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em] text-center px-4 leading-loose">
        © 2026 HABEMUS INFO - TODOS LOS DERECHOS RESERVADOS
      </p>
    </footer>
  );
}