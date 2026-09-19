"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "./store-provider";
import { Icon } from "./icons";
import { products, productImage, formatPrice } from "@/lib/catalog";

export function BrandLogo() {
  return <span className="brand-logo">LUVEX</span>;
}

export function Header() {
  const { count, openCart } = useStore();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const results = products.filter((p) =>
    `${p.name} ${p.colors.join(" ")}`
      .toLocaleLowerCase("es")
      .includes(query.toLocaleLowerCase("es").trim()),
  );

  useEffect(() => {
    if (search) dialog.current?.showModal();
    else dialog.current?.close();
    if (!search) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [search]);

  return (
    <>
      <div className="model-banner">
        <span className="banner-dot" /> UNA EXPERIENCIA CREADA CON GPT-6 · CODEX{" "}
        <span className="banner-right">DISEÑO QUE CONECTA.</span>
      </div>
      <header className="header">
        <Link
          href="/"
          aria-label="LUVEX, inicio"
          onClick={() => setMenu(false)}
        >
          <BrandLogo />
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <Link
            className={pathname === "/tienda" ? "active" : ""}
            href="/tienda"
          >
            La colección
          </Link>
          <Link href="/tienda?categoria=audio">Audio</Link>
          <Link href="/tienda?categoria=fundas">Fundas</Link>
          <Link href="/#universo">Universo LUVEX</Link>
        </nav>
        <div className="header-actions">
          <span className="locale-label">CO / COP</span>
          <button
            className="icon-button"
            aria-label="Buscar productos"
            onClick={() => setSearch(true)}
          >
            <Icon name="search" />
          </button>
          <button
            className="bag-button"
            aria-label={`Abrir bolsa, ${count} productos`}
            onClick={openCart}
          >
            <Icon name="bag" />
            <span className="bag-label">Bolsa</span>
            <span className="bag-count">{count}</span>
          </button>
          <button
            className="icon-button mobile-menu-button"
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Icon name={menu ? "close" : "menu"} />
          </button>
        </div>
        {menu && (
          <nav className="mobile-menu" aria-label="Navegación móvil">
            {[
              ["La colección", "/tienda"],
              ["Audio", "/tienda?categoria=audio"],
              ["Fundas", "/tienda?categoria=fundas"],
              ["Universo LUVEX", "/#universo"],
            ].map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setMenu(false)}>
                {label}
                <Icon name="arrow" />
              </Link>
            ))}
            <span>ACCESORIOS DE TECNOLOGÍA · COLOMBIA</span>
          </nav>
        )}
      </header>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby="search-title"
        onCancel={() => setSearch(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSearch(false);
        }}
      >
        <div className="search-inner">
          <div className="dialog-heading">
            <h2 id="search-title">Encuentra lo tuyo.</h2>
            <button
              className="icon-button"
              aria-label="Cerrar búsqueda"
              onClick={() => setSearch(false)}
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="search-input">
            <Icon name="search" />
            <input
              autoFocus
              type="search"
              aria-label="Buscar por producto, modelo o color"
              placeholder="Producto, modelo o color…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <p className="eyebrow">
            {query ? `${results.length} RESULTADOS` : "EXPLORA LA COLECCIÓN"}
          </p>
          <div className="search-results">
            {results.map((product) => (
              <Link
                href={`/producto/${product.slug}`}
                key={product.id}
                onClick={() => setSearch(false)}
              >
                <Image
                  src={productImage(product)}
                  alt=""
                  width={65}
                  height={65}
                />
                <span>
                  <strong>{product.title}</strong>
                  <small>
                    {product.category === "Fundas"
                      ? `Para ${product.subtitle}`
                      : product.subtitle}
                  </small>
                </span>
                <span>{formatPrice(product.price)}</span>
                <Icon name="arrow" width={18} />
              </Link>
            ))}
            {results.length === 0 && (
              <div className="empty-results">
                <h3>No encontramos ese accesorio.</h3>
                <p>Prueba con “iPhone”, “AirPods” o un color.</p>
                <button className="text-button" onClick={() => setQuery("")}>
                  Ver todos los productos
                </button>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
