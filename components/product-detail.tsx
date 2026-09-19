"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Product, formatPrice, productImage } from "@/lib/catalog";
import { Swatches } from "./product-card";
import { Icon } from "./icons";
import { useStore } from "./store-provider";

export function ProductDetail({ product }: { product: Product }) {
  const initial = product.id === "P006" ? 2 : 0;
  const [color, setColor] = useState(initial);
  const [image, setImage] = useState(product.variantImages[initial]);
  const [quantity, setQuantity] = useState(1);
  const zoom = useRef<HTMLDialogElement>(null);
  const { add } = useStore();
  const gallery = [
    ...new Set([product.variantImages[color], ...product.images]),
  ];
  return (
    <>
      <div className="breadcrumb">
        <Link href="/tienda">La colección</Link>
        <Icon name="chevron" width={12} />
        <Link href={`/tienda?categoria=${product.category.toLowerCase()}`}>
          {product.category}
        </Link>
        <Icon name="chevron" width={12} />
        <span>{product.title}</span>
      </div>
      <div className="product-detail">
        <div className="product-gallery">
          <button
            className={`detail-main-image ${product.id === "P002" ? "photo" : ""}`}
            aria-label={`Ampliar imagen de ${product.name}`}
            onClick={() => zoom.current?.showModal()}
          >
            <Image
              src={productImage(product, image)}
              alt={`${product.name} · ${image === product.variantImages[color] ? product.colors[color] : "Vista del producto"}`}
              width={850}
              height={850}
              sizes="(max-width: 800px) 95vw, 55vw"
              preload
            />
            <span className="zoom-hint">
              <Icon name="plus" width={17} /> Ampliar
            </span>
          </button>
          <div
            className="gallery-thumbnails"
            role="group"
            aria-label="Galería de producto"
          >
            {gallery.map((src, index) => (
              <button
                key={src}
                className={src === image ? "selected" : ""}
                aria-label={`Ver imagen ${index + 1}`}
                aria-pressed={src === image}
                onClick={() => setImage(src)}
              >
                <Image
                  src={productImage(product, src)}
                  alt=""
                  width={85}
                  height={85}
                />
              </button>
            ))}
          </div>
          {product.generated && (
            <p className="image-note">
              Presentación de estudio basada en el producto real. Fotos
              originales en la galería.
            </p>
          )}
        </div>
        <div className="product-info">
          <span className="eyebrow">
            LUVEX / {product.category.toUpperCase()}
          </span>
          <h1>{product.title}</h1>
          <p className="product-subtitle">
            {product.category === "Fundas"
              ? `Para ${product.subtitle}`
              : product.subtitle}
          </p>
          <div className="detail-price">
            {formatPrice(product.price)} <span>COP</span>
          </div>
          <p className="product-description">{product.description}</p>
          <div className="detail-color">
            <p>
              Color <strong aria-live="polite">{product.colors[color]}</strong>
            </p>
            <Swatches
              product={product}
              selected={color}
              onChange={(index) => {
                setColor(index);
                setImage(product.variantImages[index]);
              }}
            />
          </div>
          <div className="add-to-cart">
            <div className="quantity">
              <button
                aria-label="Reducir cantidad"
                disabled={quantity <= 1}
                onClick={() => setQuantity(quantity - 1)}
              >
                <Icon name="minus" width={16} />
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                aria-label="Aumentar cantidad"
                disabled={quantity >= 99}
                onClick={() => setQuantity(quantity + 1)}
              >
                <Icon name="plus" width={16} />
              </button>
            </div>
            <button
              className="button dark"
              onClick={() => add(product.id, product.colors[color], quantity)}
            >
              Añadir a mi bolsa <Icon name="bag" width={19} />
            </button>
          </div>
          <p className="purchase-note">
            <Icon name="box" width={16} /> Envío y disponibilidad a confirmar
            con LUVEX.
          </p>
          <div className="product-accordions">
            <details open>
              <summary>
                Los detalles <Icon name="plus" width={16} />
              </summary>
              <dl>
                <div>
                  <dt>Producto</dt>
                  <dd>{product.name}</dd>
                </div>
                <div>
                  <dt>Color seleccionado</dt>
                  <dd>{product.colors[color]}</dd>
                </div>
                {product.category === "Fundas" && (
                  <div>
                    <dt>Compatible con</dt>
                    <dd>{product.subtitle}</dd>
                  </div>
                )}
                <div>
                  <dt>Referencia</dt>
                  <dd>{product.id}</dd>
                </div>
              </dl>
            </details>
            <details>
              <summary>
                Antes de comprar <Icon name="plus" width={16} />
              </summary>
              <p>
                {product.category === "Fundas"
                  ? "Verifica el modelo exacto de tu iPhone en Ajustes → General → Información antes de elegir tu funda. "
                  : "Consulta con LUVEX las especificaciones y el contenido de la caja antes de realizar el pago. "}
                La disponibilidad, las condiciones de entrega y el valor del
                envío se confirman al coordinar tu pedido.
              </p>
              <Link href="/ayuda" className="underlined-link">
                Ver información de compra <Icon name="arrow" width={16} />
              </Link>
            </details>
          </div>
        </div>
      </div>
      <dialog
        ref={zoom}
        className="zoom-dialog"
        aria-label={`Imagen ampliada de ${product.name}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) zoom.current?.close();
        }}
      >
        <button
          className="icon-button"
          aria-label="Cerrar imagen ampliada"
          onClick={() => zoom.current?.close()}
        >
          <Icon name="close" />
        </button>
        <Image
          src={productImage(product, image)}
          alt={product.name}
          width={1254}
          height={1254}
          sizes="90vw"
        />
      </dialog>
    </>
  );
}
