"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "./store-provider";
import { products, productImage, formatPrice } from "@/lib/catalog";
import { cartKey } from "@/lib/cart";
import { Icon } from "./icons";

export function OrderReview({ whatsapp }: { whatsapp: string }) {
  const { items, total, ready, openCart } = useStore();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const summary = [
    "MI SELECCIÓN LUVEX",
    "",
    ...items.map((item) => {
      const p = products.find((product) => product.id === item.id)!;
      return `${item.quantity} × ${p.name} · ${item.color} — ${formatPrice(p.price * item.quantity)} COP`;
    }),
    "",
    `Subtotal: ${formatPrice(total)} COP`,
    "Envío y disponibilidad por confirmar.",
    ...(name.trim() ? [`Nombre: ${name.trim()}`] : []),
    ...(city.trim() ? [`Ciudad: ${city.trim()}`] : []),
    ...(note.trim() ? [`Nota: ${note.trim()}`] : []),
    "",
    "Quisiera confirmar disponibilidad, envío y forma de pago. Este resumen no es una compra confirmada.",
  ].join("\n");
  function download() {
    const url = URL.createObjectURL(
      new Blob([summary], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "mi-seleccion-luvex.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  }
  return (
    <div className="order-page">
      <span className="eyebrow">UN PASO MÁS CERCA DE LO TUYO.</span>
      <h1>
        Tu selección.
        <br />
        <em>A tu medida.</em>
      </h1>
      {!ready ? (
        <p role="status">Recuperando tu bolsa…</p>
      ) : items.length === 0 ? (
        <div className="empty-results">
          <Icon name="bag" width={42} height={42} />
          <h2>Tu bolsa está esperando.</h2>
          <p>Elige algo que vaya contigo para preparar tu pedido.</p>
          <Link href="/tienda" className="button dark">
            Explorar la colección <Icon name="arrow" />
          </Link>
        </div>
      ) : (
        <div className="order-layout">
          <section className="order-form">
            <h2>Los detalles de tu pedido</h2>
            <p>Completa estos datos si quieres incluirlos en tu resumen.</p>
            <label>
              Tu nombre <span>(opcional)</span>
              <input
                autoComplete="name"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Cómo te llamas?"
              />
            </label>
            <label>
              Ciudad de entrega <span>(opcional)</span>
              <input
                autoComplete="address-level2"
                maxLength={100}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Tu ciudad en Colombia"
              />
            </label>
            <label>
              Algo que debamos saber <span>(opcional)</span>
              <textarea
                rows={3}
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Una pregunta sobre el producto o tu pedido…"
              />
            </label>
            <div className="order-notice">
              <Icon name="box" />
              <div>
                <strong>
                  {whatsapp
                    ? "Confirma los detalles con LUVEX"
                    : "Guarda tu selección"}
                </strong>
                <p>
                  {whatsapp
                    ? "Te llevaremos a WhatsApp con tu selección lista. LUVEX confirmará disponibilidad, envío y forma de pago."
                    : "La atención para pedidos todavía no está habilitada. Puedes guardar tu resumen mientras LUVEX activa su canal de compra."}{" "}
                  Este paso no realiza un cobro ni reserva productos.
                </p>
              </div>
            </div>
          </section>
          <aside className="order-summary">
            <div className="dialog-heading">
              <h2>Tu bolsa</h2>
              <button className="text-button" onClick={openCart}>
                Editar
              </button>
            </div>
            {items.map((item) => {
              const p = products.find((product) => product.id === item.id)!;
              return (
                <div className="order-item" key={cartKey(item)}>
                  <Image
                    src={productImage(
                      p,
                      p.variantImages[p.colors.indexOf(item.color)],
                    )}
                    alt=""
                    width={64}
                    height={72}
                  />
                  <div>
                    <strong>{p.title}</strong>
                    <small>
                      {p.category === "Fundas" ? `${p.subtitle} · ` : ""}
                      {item.color}
                    </small>
                    <small>Cantidad: {item.quantity}</small>
                  </div>
                  <span>{formatPrice(p.price * item.quantity)}</span>
                </div>
              );
            })}
            <div className="order-totals">
              <p>
                <span>Envío</span>
                <span>Por confirmar</span>
              </p>
              <p>
                <strong>Subtotal</strong>
                <strong>
                  {formatPrice(total)} <small>COP</small>
                </strong>
              </p>
            </div>
            {whatsapp && (
              <a
                className="button dark full-width"
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(summary)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Continuar por WhatsApp <Icon name="arrow-up" />
              </a>
            )}
            <button
              className={`button ${whatsapp ? "outline" : "dark"} full-width`}
              onClick={download}
            >
              Descargar mi selección <Icon name="arrow" />
            </button>
            <p className="order-status" role="status">
              {saved
                ? "Resumen descargado. Tu bolsa sigue guardada."
                : "Tu selección se guarda en este navegador."}
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
