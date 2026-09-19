import type { Metadata } from "next";
import { OrderReview } from "@/components/order-review";
export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: false },
};
export default function OrderPage() {
  const configured = process.env.LUVEX_WHATSAPP ?? "";
  const whatsapp = /^\d{10,15}$/.test(configured) ? configured : "";
  return (
    <main id="contenido">
      <OrderReview whatsapp={whatsapp} />
    </main>
  );
}
