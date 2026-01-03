"use client";
import { useEffect } from "react";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
}

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = "auto",
}: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silenciamos el error en desarrollo si el script de Google no carga
    }
  }, []);

  return (
    <div className="w-full my-8 flex flex-col items-center">
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2">
        Publicidad
      </span>

      {/* Este div simula el anuncio para que veas el espacio que ocupa */}
      <div className="w-full bg-slate-50 border border-slate-100 flex items-center justify-center min-h-[100px] md:min-h-[250px] overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: "block", minWidth: "250px" }}
          data-ad-client="ca-pub-1234567890" // ID Genérico de prueba
          data-ad-slot={dataAdSlot}
          data-ad-format={dataAdFormat}
          data-full-width-responsive="true"
        ></ins>

        {/* Texto que solo verás tú mientras no haya anuncios reales */}
        <p className="absolute text-slate-300 font-bold uppercase text-[10px] tracking-widest pointer-events-none">
          Espacio Google Ads (Slot: {dataAdSlot})
        </p>
      </div>
    </div>
  );
}
