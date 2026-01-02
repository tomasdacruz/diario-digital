"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { name: "Política", slug: "Politica" },
    { name: "Economía", slug: "Economia" },
    { name: "Sociedad", slug: "Sociedad" },
    { name: "Deportes", slug: "Deportes" },
    { name: "Cultura", slug: "Cultura" },
    { name: "Tecnología", slug: "Tecnologia" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      url: "#",
      icon: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      ),
    },
    {
      name: "X",
      url: "#",
      icon: (
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      ),
    },
    {
      name: "Facebook",
      url: "#",
      icon: (
        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
      ),
    },
  ];

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setRole(profile?.role || "reader");
      }
    };
    getUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setRole(null);
      } else if (session) {
        getUserData();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-2xl font-sans">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase">
            HABEMUS
          </span>
          <span className="bg-[#E30613] text-white px-2 py-1 font-black italic text-2xl md:text-3xl tracking-tighter">
            INFO
          </span>
        </Link>

        {/* MENÚ DESKTOP (Categorías + Redes + Auth) */}
        <div className="hidden lg:flex gap-6 items-center font-black text-[10px] tracking-widest uppercase">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?cat=${cat.slug}`}
              className="hover:text-[#E30613] transition-colors"
            >
              {cat.name}
            </Link>
          ))}

          {/* Iconos Redes Desktop */}
          <div className="flex gap-3 border-l border-white/20 pl-4 ml-2">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                className="hover:text-[#E30613] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  {link.icon}
                </svg>
              </a>
            ))}
          </div>

          {/* Botones Auth Desktop */}
          <div className="flex items-center gap-4 ml-4">
            {user ? (
              <>
                {role === "admin" && (
                  <Link
                    href="/admin"
                    className="bg-white text-black px-4 py-2 rounded hover:bg-[#E30613] hover:text-white transition-all"
                  >
                    ADMIN ⚙️
                  </Link>
                )}
                <button
                  onClick={() =>
                    supabase.auth
                      .signOut()
                      .then(() => (window.location.href = "/"))
                  }
                  className="border border-white/20 px-4 py-2 rounded hover:bg-red-600 transition-all"
                >
                  SALIR
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-[#E30613] transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#E30613] text-white px-4 py-2 rounded hover:bg-white hover:text-black transition-all"
                >
                  UNIRME
                </Link>
              </>
            )}
          </div>
        </div>

        {/* BOTÓN HAMBURGUESA (Solo móvil) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 z-50 transition-all active:scale-90"
        >
          {isOpen ? (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* MENÚ MÓVIL (Overlay) */}
      <div
        className={`fixed inset-0 bg-black text-white transition-all duration-300 transform lg:hidden z-40 ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6 font-black uppercase tracking-[0.2em] text-xl">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?cat=${cat.slug}`}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#E30613]"
            >
              {cat.name}
            </Link>
          ))}

          <div className="w-20 h-[2px] bg-[#E30613]/50 my-4"></div>

          {user ? (
            <>
              {role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-sm border border-white/20 px-8 py-3 rounded-xl"
                >
                  PANEL ADMIN
                </Link>
              )}
              <button
                onClick={() =>
                  supabase.auth
                    .signOut()
                    .then(() => (window.location.href = "/"))
                }
                className="text-sm bg-red-600 px-8 py-3 rounded-xl"
              >
                CERRAR SESIÓN
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4 w-full px-10">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center border-2 border-white/20 py-4 rounded-xl text-sm"
              >
                INGRESAR
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="text-center bg-[#E30613] py-4 rounded-xl text-sm"
              >
                UNIRME AHORA
              </Link>
            </div>
          )}

          {/* Redes en Móvil */}
          <div className="flex gap-8 mt-8">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                className="text-white hover:text-[#E30613]"
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  {link.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
