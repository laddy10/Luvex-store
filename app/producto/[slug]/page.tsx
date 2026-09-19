import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/catalog";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";
import { Icon } from "@/components/icons";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  return {
    title: product?.name ?? "Producto no encontrado",
    description: product?.description,
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  const related = products
    .filter((p) => p.id !== product.id)
    .sort(
      (a, b) =>
        Number(b.category === product.category) -
        Number(a.category === product.category),
    )
    .slice(0, 4);
  return (
    <main id="contenido" className="product-page">
      <ProductDetail product={product} />
      <section className="related section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HAZ TU PROPIA COMBINACIÓN</span>
            <h2>
              También van <em>contigo.</em>
            </h2>
          </div>
          <Link className="underlined-link" href="/tienda">
            Ver colección <Icon name="arrow-up" width={18} />
          </Link>
        </div>
        <div className="product-grid">
          {related.map((item, index) => (
            <ProductCard product={item} key={item.id} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
