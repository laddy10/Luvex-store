import catalog from "../data/products.json";

export type Category = "Todos" | "Audio" | "Fundas";
export type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  colors: string[];
  folder: string;
  status: string;
  slug: string;
  category: Exclude<Category, "Todos">;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  variantImages: string[];
  generated?: boolean;
};

// Presentation only. Names, prices, colors and publication status come from products.json.
const presentation: Record<
  string,
  Omit<
    Product,
    "id" | "name" | "price" | "currency" | "colors" | "folder" | "status"
  >
> = {
  P001: {
    slug: "airpods-max",
    category: "Audio",
    title: "AirPods Max",
    subtitle: "Tu música. A tu manera.",
    description:
      "Dale un lugar especial a tu música. Un diseño que se hace notar, en tres colores para encontrar el tuyo.",
    images: [
      "headphones-max-1.png",
      "headphones-max-2.png",
      "headphones-max-3.png",
      "headphones-max-7.jpeg",
      "headphones-max-6.jpeg",
    ],
    variantImages: [
      "headphones-max-1.png",
      "headphones-max-2.png",
      "headphones-max-3.png",
    ],
  },
  P002: {
    slug: "airpods-pro-3",
    category: "Audio",
    title: "AirPods Pro 3",
    subtitle: "Tu día, con otra banda sonora.",
    description:
      "Para esa canción que siempre repites y los momentos que son solo tuyos. Un formato pequeño que va contigo.",
    images: ["AirPods-2.jpeg", "AirPods-3.jpeg", "AirPods-1.jpeg"],
    variantImages: ["AirPods-2.jpeg"],
  },
  P003: {
    slug: "funda-magsafe-iphone-15-pro-max",
    category: "Fundas",
    title: "Funda MagSafe",
    subtitle: "iPhone 15 Pro Max",
    description:
      "Transparencia con un toque de morado. Una funda con aro MagSafe para darle a tu iPhone un detalle diferente.",
    images: [
      "cases-2.png",
      "cases-1.jpeg",
      "/products/studio/case-15pm-purple.png",
    ],
    variantImages: ["cases-2.png"],
    generated: true,
  },
  P004: {
    slug: "funda-magsafe-iphone-16-pro-max",
    category: "Fundas",
    title: "Funda MagSafe",
    subtitle: "iPhone 16 Pro Max",
    description:
      "Deja ver tu iPhone. Los bordes dorados y el aro MagSafe aportan el detalle que hace la diferencia.",
    images: [
      "case-3.png",
      "cases-1.jpeg",
      "case-2.jpeg",
      "/products/studio/case-16pm-gold.png",
    ],
    variantImages: ["case-3.png"],
    generated: true,
  },
  P005: {
    slug: "funda-silicona-iphone-14",
    category: "Fundas",
    title: "Funda de silicona",
    subtitle: "iPhone 14",
    description:
      "Verde claro, acabado mate y una forma sencilla de cambiar el estilo de tu iPhone. Los pequeños detalles también cuentan.",
    images: [
      "case-green-7.png",
      "case-green-1.jpeg",
      "case-green-2.jpeg",
      "/products/studio/case-14-green.png",
    ],
    variantImages: ["case-green-7.png"],
    generated: true,
  },
  P006: {
    slug: "funda-silicona-iphone-14-pro-max",
    category: "Fundas",
    title: "Funda de silicona",
    subtitle: "iPhone 14 Pro Max",
    description:
      "El mismo diseño, tu color. Silicona mate en negro, azul oscuro o lila para acompañar tu estilo de todos los días.",
    images: [
      "case-purple-7.png",
      "case-purple-8.png",
      "case-black-10.png",
      "case-purple-1.jpeg",
      "case-purple-2.jpeg",
    ],
    variantImages: [
      "case-black-10.png",
      "case-purple-8.png",
      "case-purple-7.png",
    ],
    generated: true,
  },
  P007: {
    slug: "funda-silicona-iphone-16-pro-max",
    category: "Fundas",
    title: "Funda de silicona",
    subtitle: "iPhone 16 Pro Max",
    description:
      "Un tono oscuro que combina con todo. Silicona mate y una presencia discreta para tu iPhone 16 Pro Max.",
    images: [
      "/products/studio/case-16pm-midnight.png",
      "silicone-1.jpeg",
      "silicone-3.jpeg",
    ],
    variantImages: ["/products/studio/case-16pm-midnight.png"],
    generated: true,
  },
};

export const products: Product[] = catalog
  .filter(
    (p) =>
      p.status === "confirmed" &&
      typeof p.price === "number" &&
      presentation[p.id],
  )
  .map((p) => ({ ...p, price: p.price as number, ...presentation[p.id] }));

export function productImage(
  product: Product,
  image = product.variantImages[0],
) {
  return image.startsWith("/") ? image : `${product.folder}/${image}`;
}

export function formatPrice(value: number) {
  return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value)}`;
}

export const swatchColors: Record<string, string> = {
  Negro: "#303130",
  Verde: "#a4b29b",
  "Gris/Plata": "#c1c3c4",
  Blanco: "#fafaf7",
  "Transparente con borde morado": "#807086",
  "Transparente con borde dorado": "#ba9d69",
  "Verde claro": "#afd09c",
  "Azul oscuro": "#23314d",
  "Lila/Morado claro": "#c8b9df",
  "Negro/Azul noche": "#303849",
};
