"use client"; // <--- Esto le dice a Next.js que aquí sí podemos usar Hooks

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import BotonSuscripcion from "@/components/BotonSuscripcion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NoticiaContenedor({ post }: { post: any }) {
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Función de limpieza de texto
  const limpiarContenido = (html: string) => {
    if (!html) return "";
    return html
      .replace(/&nbsp;/g, " ")
      .replace(/\u00A0/g, " ")
      .replace(/<span[^>]*>/g, "")
      .replace(/<\/span>/g, "");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium")
          .eq("id", session.user.id)
          .single();
        setIsPremiumUser(profile?.is_premium || false);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Mientras verifica la sesión, mostramos un estado de carga suave
  if (post.is_premium && loading) {
    return <div className="h-60 bg-gray-50 animate-pulse rounded-3xl" />;
  }

  // Si es premium y el usuario no pagó
  if (post.is_premium && !isPremiumUser) {
    return (
      <section className="relative w-full block">
        <div className="relative">
          <div
            className="noticia-cuerpo text-lg md:text-2xl text-slate-800 opacity-20 select-none pointer-events-none mb-10 h-60 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 80%)",
            }}
            dangerouslySetInnerHTML={{
              __html: limpiarContenido(post.content.substring(0, 450)),
            }}
          />
          <div className="absolute top-0 left-0 w-full flex justify-center pt-5">
            <div className="bg-[#0f172a] text-white p-8 md:p-16 rounded-[3rem] text-center shadow-2xl border-b-8 border-[#E30613] max-w-2xl w-full mx-2">
              <span className="text-6xl mb-8 block">🔒</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-8 italic">
                Acceso Premium
              </h2>
              <p className="text-slate-400 text-lg mb-12 font-medium">
                Esta noticia es exclusiva para socios.
              </p>

              {session ? (
                <BotonSuscripcion
                  userId={session.user.id}
                  email={session.user.email!}
                />
              ) : (
                <Link
                  href="/signup"
                  className="inline-block w-full bg-[#E30613] text-white font-black py-6 rounded-2xl transition-all text-xl uppercase tracking-widest shadow-xl text-center"
                >
                  CREAR CUENTA GRATIS
                </Link>
              )}

              <Link
                href="/login"
                className="mt-8 block text-xs font-bold underline text-slate-500 uppercase tracking-widest"
              >
                Ya soy Premium, entrar
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Caso normal: Noticia gratis o usuario Premium
  return (
    <div className="w-full block">
      <div
        className="noticia-cuerpo text-lg md:text-2xl text-slate-900"
        dangerouslySetInnerHTML={{ __html: limpiarContenido(post.content) }}
      />
      <div className="mt-16 pt-10 border-t border-gray-100">
        <AdBanner dataAdSlot="0000000004" />
      </div>
    </div>
  );
}
