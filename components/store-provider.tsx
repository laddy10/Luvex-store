"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { products, productImage, formatPrice } from "@/lib/catalog";
import { CartItem, cartKey, cartTotal, validateCart } from "@/lib/cart";
import { Icon } from "./icons";

type StoreContext = {
  items: CartItem[];
  ready: boolean;
  count: number;
  total: number;
  add: (id: string, color: string, quantity?: number) => void;
  update: (key: string, quantity: number) => void;
  openCart: () => void;
};
const Context = createContext<StoreContext | null>(null);
const STORAGE_KEY = "luvex-cart-v1";

export function useStore() {
  const context = useContext(Context);
  if (!context) throw new Error("StoreProvider is required");
  return context;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let initial: CartItem[] = [];
    try {
      initial = validateCart(
        JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
      );
    } catch {
      /* Storage may be unavailable. */
    }
    queueMicrotask(() => {
      setItems(initial);
      setReady(true);
    });
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        try {
          setItems(validateCart(JSON.parse(event.newValue || "[]")));
        } catch {
          setItems([]);
        }
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        /* Keep the cart usable in memory. */
      }
    }
  }, [items, ready]);

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const add = useCallback((id: string, color: string, quantity = 1) => {
    setItems((current) => validateCart([...current, { id, color, quantity }]));
    setOpen(true);
  }, []);
  const update = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      validateCart(
        current.map((item) =>
          cartKey(item) === key ? { ...item, quantity } : item,
        ),
      ),
    );
  }, []);
  const total = cartTotal(items);
  const count = items.reduce((n, item) => n + item.quantity, 0);

  return (
    <Context.Provider
      value={{
        items,
        ready,
        count,
        total,
        add,
        update,
        openCart: () => setOpen(true),
      }}
    >
      {children}
      <dialog
        ref={dialog}
        className="cart-dialog"
        aria-labelledby="cart-title"
        onCancel={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="cart-panel">
          <div className="dialog-heading">
            <div>
              <span className="eyebrow">TU SELECCIÓN</span>
              <h2 id="cart-title">
                Tu bolsa <span>({count})</span>
              </h2>
            </div>
            <button
              className="icon-button"
              aria-label="Cerrar bolsa"
              onClick={() => setOpen(false)}
            >
              <Icon name="close" />
            </button>
          </div>
          {items.length === 0 ? (
            <div className="cart-empty">
              <Icon name="bag" width={48} height={48} />
              <h3>Algo muy tuyo te espera.</h3>
              <p>Encuentra tu próximo accesorio favorito.</p>
              <Link
                className="button dark"
                href="/tienda"
                onClick={() => setOpen(false)}
              >
                Explorar la colección <Icon name="arrow" />
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => {
                  const product = products.find((p) => p.id === item.id)!;
                  const key = cartKey(item);
                  return (
                    <article className="cart-item" key={key}>
                      <Link
                        href={`/producto/${product.slug}`}
                        onClick={() => setOpen(false)}
                        className="cart-image"
                      >
                        <Image
                          src={productImage(
                            product,
                            product.variantImages[
                              product.colors.indexOf(item.color)
                            ],
                          )}
                          alt={`${product.name}, ${item.color}`}
                          width={110}
                          height={130}
                        />
                      </Link>
                      <div className="cart-item-info">
                        <Link
                          href={`/producto/${product.slug}`}
                          onClick={() => setOpen(false)}
                        >
                          {product.title}
                        </Link>
                        <p>
                          {product.category === "Fundas"
                            ? `${product.subtitle} · `
                            : ""}
                          {item.color}
                        </p>
                        <strong>{formatPrice(product.price)}</strong>
                        <div className="quantity">
                          <button
                            aria-label={`Quitar una unidad de ${product.title}`}
                            onClick={() => update(key, item.quantity - 1)}
                          >
                            <Icon name="minus" width={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            disabled={item.quantity >= 99}
                            aria-label={`Añadir una unidad de ${product.title}`}
                            onClick={() => update(key, item.quantity + 1)}
                          >
                            <Icon name="plus" width={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="icon-button remove"
                        aria-label={`Eliminar ${product.title} de la bolsa`}
                        onClick={() => update(key, 0)}
                      >
                        <Icon name="trash" width={17} />
                      </button>
                    </article>
                  );
                })}
              </div>
              <div className="cart-bottom">
                <div className="subtotal">
                  <span>Subtotal</span>
                  <strong>
                    {formatPrice(total)} <small>COP</small>
                  </strong>
                </div>
                <p>El envío y la disponibilidad se confirman antes del pago.</p>
                <Link
                  className="button dark full-width"
                  href="/pedido"
                  onClick={() => setOpen(false)}
                >
                  Revisar mi pedido <Icon name="arrow" />
                </Link>
                <button className="text-button" onClick={() => setOpen(false)}>
                  Seguir explorando
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </Context.Provider>
  );
}
