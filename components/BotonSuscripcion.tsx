"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

export default function BotonSuscripcion({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const handlePayment = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userEmail: email }),
      });
      const data = await res.json();
      if (data.init_url) {
        window.location.href = data.init_url;
      } else {
        alert("Error al iniciar el pago");
      }
    } catch (error) {
      alert("Hubo un problema con la conexión");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-[#E30613] hover:bg-white hover:text-black text-white font-black py-6 rounded-2xl transition-all text-xl uppercase tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-3"
    >
      <FontAwesomeIcon icon={faCreditCard} />
      Suscribirme ahora ($2500)
    </button>
  );
}
