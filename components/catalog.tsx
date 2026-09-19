"use client";
import { useState } from "react";
import Link from "next/link";
import { Category, products } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { Icon } from "./icons";

export function Catalog({
  full = false,
  initialCategory = "Todos",
}: {
  full?: boolean;
  initialCategory?: Category;
}) {
  const [category, setCategory] = useState<Category>(initialCategory);
  const [sort, setSort] = useState("selection");
  const [model, setModel] = useState("all");
  const [query, setQuery] = useState("");
  const visible = products.filter(
    (p) =>
      (category === "Todos" || p.category === category) &&
      (model === "all" || p.subtitle === model) &&
      p.name.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")),
  );
  if (sort === "low") visible.sort((a, b) => a.price - b.price);
  if (sort === "high") visible.sort((a, b) => b.price - a.price);
  const shown =
    full || category !== "Todos"
      ? visible
      : [products[0], products[1], products[5], products[3]];
  // Keep short selections compact and center incomplete rows at the same card size.
  const columns =
    shown.length <= 3
      ? Math.max(1, shown.length)
      : shown.length <= 6 && shown.length !== 4
        ? 3
        : 4;
  const imageSizes =
    columns === 1
      ? "(max-width: 386px) 88vw, 340px"
      : `(max-width: 600px) 44vw, (max-width: 800px) 45vw, ${columns === 2 ? "360px" : columns === 3 ? "(max-width: 1200px) 30vw, 360px" : "(max-width: 1600px) 23vw, 400px"}`;
  return (
    <section
      className={`catalog section-space ${full ? "full-catalog" : ""}`}
      id="seleccion"
      aria-label="Colección de productos"
    >
      {!full && (
        <div className="section-heading">
          <div>
            <span className="eyebrow">POCOS OBJETOS. MUCHA PERSONALIDAD.</span>
            <h2>
              Los que van <em>contigo.</em>
            </h2>
          </div>
          <Link href="/tienda" className="underlined-link">
            Ver toda la colección <Icon name="arrow-up" width={18} />
          </Link>
        </div>
      )}
      <div className="catalog-toolbar">
        <div
          className="category-tabs"
          role="group"
          aria-label="Filtrar por categoría"
        >
          {(["Todos", "Audio", "Fundas"] as Category[]).map((item) => (
            <button
              key={item}
              aria-pressed={category === item}
              className={category === item ? "selected" : ""}
              onClick={() => {
                setCategory(item);
                setModel("all");
                if (full)
                  window.history.replaceState(
                    null,
                    "",
                    item === "Todos"
                      ? "/tienda"
                      : `/tienda?categoria=${item.toLowerCase()}`,
                  );
              }}
            >
              {item}
              <span>
                {
                  products.filter(
                    (p) => item === "Todos" || p.category === item,
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
        {full ? (
          <label className="sort-select">
            Ordenar{" "}
            <select
              aria-label="Ordenar productos"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="selection">Selección LUVEX</option>
              <option value="low">Menor precio</option>
              <option value="high">Mayor precio</option>
            </select>
          </label>
        ) : (
          <span className="catalog-note">TU PRÓXIMO FAVORITO ESTÁ AQUÍ.</span>
        )}
      </div>
      {full && (
        <div className="catalog-filters">
          <label className="catalog-search">
            <Icon name="search" width={18} />
            <input
              type="search"
              aria-label="Buscar en la colección"
              placeholder="Busca tu accesorio…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          {category !== "Audio" && (
            <label className="model-select">
              Tu iPhone{" "}
              <select
                aria-label="Filtrar por modelo de iPhone"
                value={model}
                onChange={(event) => setModel(event.target.value)}
              >
                <option value="all">Todos los modelos</option>
                {[
                  ...new Set(
                    products
                      .filter((p) => p.category === "Fundas")
                      .map((p) => p.subtitle),
                  ),
                ].map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
          )}
          <span aria-live="polite">
            {visible.length} {visible.length === 1 ? "producto" : "productos"}
          </span>
        </div>
      )}
      <div className="product-grid catalog-grid" data-columns={columns}>
        {shown.map((product, index) => (
          <ProductCard
            product={product}
            key={product.id}
            index={index}
            imageSizes={imageSizes}
          />
        ))}
      </div>
      {shown.length === 0 && (
        <div className="empty-results">
          <h3>No encontramos esa combinación.</h3>
          <p>Prueba con otro modelo o explora la colección completa.</p>
          <button
            className="button dark"
            onClick={() => {
              setCategory("Todos");
              setModel("all");
              setQuery("");
            }}
          >
            Restablecer filtros
          </button>
        </div>
      )}
    </section>
  );
}
