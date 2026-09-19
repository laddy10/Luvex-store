import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Antes de comprar" };
export default function HelpPage() {
  return (
    <main id="contenido" className="help-page">
      <span className="eyebrow">LOS DETALLES, CLAROS.</span>
      <h1>
        Elige con
        <br />
        <em>confianza.</em>
      </h1>
      <p className="help-intro">
        Lo que necesitas saber antes de preparar tu pedido.
      </p>
      <div className="help-content">
        <details open>
          <summary>¿Cómo encuentro la funda para mi iPhone?</summary>
          <p>
            En tu iPhone, entra a Ajustes → General → Información y revisa
            “Nombre del modelo”. Elige una funda cuyo modelo coincida
            exactamente. Una funda de iPhone 14 no es intercambiable con una de
            iPhone 14 Pro Max.
          </p>
          <Link className="underlined-link" href="/tienda?categoria=fundas">
            Explorar fundas por modelo →
          </Link>
        </details>
        <details>
          <summary>¿Cómo preparo mi pedido?</summary>
          <p>
            Selecciona tus productos y colores, añádelos a la bolsa y revisa el
            resumen. Puedes descargar tu selección. Cuando el canal comercial
            esté habilitado, podrás enviarla a LUVEX para confirmar
            disponibilidad, entrega y pago. Añadir productos a la bolsa no
            reserva inventario.
          </p>
        </details>
        <details>
          <summary>¿En qué moneda están los precios?</summary>
          <p>
            Todos los precios se muestran en pesos colombianos (COP). El
            subtotal corresponde a los productos seleccionados. El envío se
            cotiza por separado antes de confirmar la compra.
          </p>
        </details>
        <details>
          <summary>Envíos, pagos y cambios</summary>
          <p>
            Consulta con LUVEX la cobertura, el costo y el tiempo de entrega,
            los medios de pago y las condiciones de cambios antes de pagar.
            Estas condiciones todavía no están publicadas en la tienda. No se
            procesan pagos en este sitio.
          </p>
        </details>
        <details>
          <summary>Sobre las fotografías y los productos</summary>
          <p>
            Las fotografías de estudio de las fundas fueron preparadas con
            asistencia de IA a partir de referencias reales. Puedes ver las
            imágenes originales en las galerías. Los tonos pueden variar según
            tu pantalla. Los nombres del catálogo no implican certificación ni
            afiliación oficial; consulta con LUVEX las especificaciones y la
            procedencia antes de comprar.
          </p>
        </details>
        <section id="privacidad">
          <h2>Tu privacidad</h2>
          <p>
            La bolsa se guarda en el almacenamiento local de tu navegador. No
            solicitamos datos de tarjeta ni enviamos tu selección a un servidor.
            Los datos que escribas al preparar un pedido solo se incorporan al
            resumen que decidas descargar o enviar. Puedes borrar la bolsa
            eliminando sus productos o limpiando los datos del sitio en tu
            navegador.
          </p>
          <p>
            Si continúas hacia WhatsApp, se aplican también las condiciones y
            políticas de ese servicio.
          </p>
        </section>
      </div>
    </main>
  );
}
