import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { Category, products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "La colección",
  description:
    "Audio y fundas para iPhone. Descubre la colección LUVEX con precios en pesos colombianos.",
};
export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const category: Category =
    categoria === "audio"
      ? "Audio"
      : categoria === "fundas"
        ? "Fundas"
        : "Todos";
  return (
    <main id="contenido">
      <div className="shop-heading">
        <span className="eyebrow">LA COLECCIÓN LUVEX</span>
        <h1>
          Pequeños detalles.
          <br />
          <em>Muy tuyos.</em>
        </h1>
        <p>Audio y accesorios que encuentran su lugar en tu día.</p>
        <span className="shop-index">
          OBJETOS PARA CONECTAR / 01—{String(products.length).padStart(2, "0")}
        </span>
      </div>
      <Catalog key={category} full initialCategory={category} />
    </main>
  );
}
