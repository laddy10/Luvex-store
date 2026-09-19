"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Product,
  productImage,
  formatPrice,
  swatchColors,
} from "@/lib/catalog";
import { Icon } from "./icons";
import { useStore } from "./store-provider";

export function Swatches({
  product,
  selected,
  onChange,
}: {
  product: Product;
  selected: number;
  onChange: (index: number) => void;
}) {
  return (
    <div
      className="swatches"
      role="group"
      aria-label={`Color de ${product.name}`}
    >
      {product.colors.map((color, index) => (
        <button
          type="button"
          key={color}
          className={`swatch ${selected === index ? "selected" : ""}`}
          style={
            { "--swatch": swatchColors[color] || "#ccc" } as React.CSSProperties
          }
          aria-label={color}
          title={color}
          aria-pressed={selected === index}
          onClick={() => onChange(index)}
        >
          <span />
        </button>
      ))}
    </div>
  );
}

export function ProductCard({
  product,
  index = 0,
  imageSizes = "(max-width: 600px) 44vw, (max-width: 800px) 45vw, (max-width: 1600px) 23vw, 400px",
}: {
  product: Product;
  index?: number;
  imageSizes?: string;
}) {
  const [selected, setSelected] = useState(product.id === "P006" ? 2 : 0);
  const { add } = useStore();
  return (
    <article className="product-card">
      <div
        className={`card-visual ${product.category === "Audio" ? "audio-visual" : "case-visual"} ${product.id === "P002" ? "photo-visual" : ""}`}
      >
        <span className="card-label">
          {product.category === "Audio"
            ? "AUDIO"
            : product.title === "Funda MagSafe"
              ? "MAGSAFE"
              : "SILICONA MATE"}
        </span>
        <span className="card-number">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Link
          href={`/producto/${product.slug}`}
          aria-label={`Ver ${product.name}`}
        >
          <Image
            src={productImage(product, product.variantImages[selected])}
            alt={`${product.name} en ${product.colors[selected]}`}
            fill
            sizes={imageSizes}
          />
        </Link>
        <button
          className="quick-add"
          aria-label={`Añadir ${product.name}, ${product.colors[selected]} a la bolsa`}
          onClick={() => add(product.id, product.colors[selected])}
        >
          <Icon name="plus" />
        </button>
      </div>
      <div className="card-copy">
        <Link href={`/producto/${product.slug}`}>
          <h3>{product.title}</h3>
          <p>
            {product.category === "Audio"
              ? product.subtitle
              : `Para ${product.subtitle}`}
          </p>
        </Link>
        <strong>{formatPrice(product.price)}</strong>
      </div>
      <div className="card-bottom">
        <Swatches
          product={product}
          selected={selected}
          onChange={setSelected}
        />
        <span title={product.colors[selected]} aria-live="polite">
          {product.colors[selected]}
        </span>
      </div>
    </article>
  );
}
