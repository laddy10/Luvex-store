"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Product, formatPrice, productImage } from "@/lib/catalog";
import { Swatches } from "./product-card";
import { Icon } from "./icons";

export function Hero({ product }: { product: Product }) {
  const [color, setColor] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = stage.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        element.style.setProperty(
          "--hero-scroll",
          String(Math.min(1, window.scrollY / window.innerHeight)),
        );
        frame = 0;
      });
    };
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => {
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-topline">
        <span>
          <span className="tiny-cross">+</span> TECNOLOGÍA CON IDENTIDAD
        </span>
        <span>LA SELECCIÓN LUVEX / 01</span>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="small-line" /> DISEÑADO PARA TU DÍA A DÍA
        </p>
        <h1 id="hero-title">
          Tu mundo.
          <br />
          Tu ritmo.
          <br />
          <span>Tu estilo.</span>
        </h1>
        <p className="hero-description">
          Accesorios que conectan con lo que eres.
          <br />
          Elige los detalles. Hazlos tuyos.
        </p>
        <Link className="button dark" href="/tienda">
          Explorar la colección <Icon name="arrow" />
        </Link>
        <a href="#seleccion" className="hero-scroll">
          <span>↓</span> DESLIZA Y DESCUBRE
        </a>
      </div>
      <div className="hero-stage" ref={stage}>
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <span className="hero-vertical">SONIDO · FORMA · EXPRESIÓN</span>
        <span className="hero-product-word" aria-hidden="true">
          MAX
        </span>
        <div className="hero-product">
          {product.variantImages.map((src, index) => (
            <Image
              key={src}
              src={productImage(product, src)}
              alt={
                index === color
                  ? `${product.name} en ${product.colors[color]}`
                  : ""
              }
              aria-hidden={index !== color}
              width={800}
              height={800}
              sizes="(max-width: 700px) 95vw, 58vw"
              preload={index === 0}
              className={index === color ? "visible" : ""}
            />
          ))}
        </div>
        <div className="hero-coordinate">
          L / 01<span>UN NUEVO RITMO</span>
        </div>
        <div className="hero-product-caption">
          <div>
            <span className="eyebrow">EL PROTAGONISTA</span>
            <Link href={`/producto/${product.slug}`}>
              {product.name}
              <Icon name="arrow-up" width={20} />
            </Link>
            <span className="hero-price">
              {formatPrice(product.price)} <small>COP</small>
            </span>
          </div>
          <div className="hero-colors">
            <Swatches product={product} selected={color} onChange={setColor} />
            <span aria-live="polite">{product.colors[color]}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SoundStory({ product }: { product: Product }) {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const composition = element.querySelector<HTMLElement>(".sound-stage");
    const readMedia = (query: string) => {
      try {
        return typeof window.matchMedia === "function"
          ? window.matchMedia(query)
          : null;
      } catch {
        return null;
      }
    };
    const reducedMotion = readMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = readMedia(
      "(max-width: 1100px), (max-height: 700px)",
    );
    const mobileLayout = readMedia("(max-width: 1100px)");
    const isMobile = () => mobileLayout?.matches ?? window.innerWidth <= 1100;
    const isReduced = () => {
      if (reducedMotion) return reducedMotion.matches;
      // CSS remains the accessibility authority if matchMedia is unavailable.
      try {
        return window.getComputedStyle(element)
          .getPropertyValue("--sound-reduced-motion").trim() !== "0";
      } catch {
        return true;
      }
    };
    const hasFrames =
      typeof window.requestAnimationFrame === "function" &&
      typeof window.cancelAnimationFrame === "function";
    const requestFrame = (callback: () => void) =>
      hasFrames
        ? window.requestAnimationFrame(callback)
        : window.setTimeout(callback, 16);
    const cancelFrame = (id: number) => {
      if (hasFrames) window.cancelAnimationFrame(id);
      else window.clearTimeout(id);
    };
    const variants = [0, 1, 2].map((index) => ({
      product: element.querySelector<HTMLElement>(`.sound-product-${index}`),
      image: element.querySelector<HTMLElement>(`.sound-product-${index} img`),
      label: element.querySelector<HTMLElement>(`.sound-color-${index}`),
      line: element.querySelector<HTMLElement>(`.sound-color-${index} .sound-mobile-line`),
    }));
    const probe = document.createElement("span");
    probe.style.transform = "translate(-50%, -50%) translate(1px, 1px) rotate(1deg) scale(1)";
    const canTransform = !!probe.style.transform;
    const focusProperties = [
      "--green-focus", "--silver-focus", "--black-focus", "--focus-total",
    ];
    let directMobile = false;
    let mobileValues: {
      travel: number;
      lift: number;
      turn: number;
      angle: number;
      growth: number;
      recession: number;
    }[] | null = null;
    const clearMobile = () => {
      if (!directMobile) return;
      for (const variant of variants) {
        for (const node of [variant.product, variant.image, variant.label, variant.line]) {
          node?.style.removeProperty("transform");
          node?.style.removeProperty("opacity");
        }
      }
      element.removeAttribute("data-sound-render");
      directMobile = false;
      mobileValues = null;
    };
    const restoreStatic = () => {
      clearMobile();
      element.style.removeProperty("--progress");
      focusProperties.forEach((property) => element.style.removeProperty(property));
    };
    const renderMobile = (weights: number[], total: number) => {
      if (!directMobile) {
        // Keep the CSS fallback at rest; mobile rendering uses concrete values.
        focusProperties.forEach((property) => element.style.removeProperty(property));
        element.setAttribute("data-sound-render", "direct");
        directMobile = true;
      }
      if (!mobileValues) {
        const small = window.innerWidth <= 600;
        mobileValues = variants.map((variant, index) => {
          let styles: CSSStyleDeclaration | null = null;
          try {
            if (variant.product) styles = window.getComputedStyle(variant.product);
          } catch { /* Use the approved values if computed styles are unavailable. */ }
          const value = (name: string, fallback: number) => {
            const number = parseFloat(styles?.getPropertyValue(name) || "");
            return Number.isFinite(number) ? number : fallback;
          };
          return {
            travel: value("--travel", (index - 1) * (small ? 12 : 35)),
            lift: value("--lift", small ? (index === 1 ? -34 : -28) : (index === 1 ? -32 : -8)),
            turn: value("--turn", [-1.5, 0.8, 1.5][index]),
            angle: value("--angle", [-9, -2, 9][index]),
            growth: value("--focus-growth", small ? 0.07 : 0.05),
            recession: value("--recede-scale", small ? 0.06 : 0.04),
          };
        });
      }
      variants.forEach((variant, index) => {
        const focus = Math.max(0, Math.min(1, weights[index]));
        const recede = Math.max(0, Math.min(1, total - focus));
        const values = mobileValues![index];
        if (canTransform) {
          if (variant.product) {
            variant.product.style.transform = `translate(-50%, -50%) translate(${focus * values.travel}px, ${focus * values.lift}px)`;
            variant.product.style.opacity = String(1 - recede * 0.12);
          }
          if (variant.image) {
            variant.image.style.transform = `rotate(${values.angle + focus * values.turn}deg) scale(${1 + focus * values.growth - recede * values.recession})`;
          }
        }
        // Labels still tell the story if transforms are not supported.
        if (variant.label) variant.label.style.opacity = String(1 - recede * 0.35);
        if (variant.line) {
          variant.line.style.opacity = String(focus);
          if (canTransform) variant.line.style.transform = `scaleX(${focus})`;
        }
      });
    };
    let frame: number | null = null;
    const update = () => {
      if (isReduced()) {
        if (frame !== null) cancelFrame(frame);
        frame = null;
        restoreStatic();
        return;
      }
      if (frame !== null) return;
      frame = requestFrame(() => {
        frame = null;
        if (isReduced()) {
          restoreStatic();
          return;
        }
        const rect = element.getBoundingClientRect();
        const compact = compactLayout?.matches ?? (window.innerWidth <= 1100 || window.innerHeight <= 700);
        const stageRect = compact
          ? composition?.getBoundingClientRect()
          : undefined;
        const progress = Math.max(
          0,
          Math.min(
            1,
            stageRect
              ? isMobile()
                // Present all five phases as the stage center crosses 80% → 20%
                // of the viewport, instead of finishing during its entrance.
                ? (window.innerHeight * 0.8 - (stageRect.top + stageRect.height / 2)) /
                  Math.max(1, window.innerHeight * 0.6)
                : (window.innerHeight * 0.85 - stageRect.top) /
                  Math.max(1, Math.min(stageRect.height, window.innerHeight * 0.7))
              : -rect.top / Math.max(1, rect.height - window.innerHeight),
          ),
        );
        element.style.setProperty("--progress", String(progress));
        // Establish 0–15%, green 15–35%, silver 35–55%, black 55–78%,
        // then resolve by 92% and hold the approved resting composition.
        const transition = (start: number, end: number) => {
          const phase = Math.max(0, Math.min(1, (progress - start) / (end - start)));
          return phase ** 3 * (phase * (phase * 6 - 15) + 10);
        };
        const green = transition(0.15, 0.25);
        const silver = transition(0.35, 0.45);
        const black = transition(0.55, 0.65);
        const resolution = transition(0.78, 0.92);
        if (isMobile()) {
          renderMobile([green - silver, silver - black, black - resolution], green - resolution);
        } else {
          clearMobile();
          // Preserve the existing desktop CSS rendering path and focus weights.
          element.style.setProperty("--green-focus", String(green - silver));
          element.style.setProperty("--silver-focus", String(silver - black));
          element.style.setProperty("--black-focus", String(black - resolution));
          element.style.setProperty("--focus-total", String(green - resolution));
        }
      });
    };
    const resize = () => {
      mobileValues = null;
      update();
    };
    const syncMotion = () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      if (frame !== null) cancelFrame(frame);
      frame = null;
      if (isReduced()) {
        restoreStatic();
      } else {
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", resize);
        update();
      }
    };
    let unsubscribe = () => {};
    if (reducedMotion) {
      let subscribed = false;
      if (typeof reducedMotion.addEventListener === "function" &&
          typeof reducedMotion.removeEventListener === "function") {
        try {
          reducedMotion.addEventListener("change", syncMotion);
          unsubscribe = () => reducedMotion.removeEventListener("change", syncMotion);
          subscribed = true;
        } catch { /* Try the legacy API without preventing initialization. */ }
      }
      if (!subscribed && typeof reducedMotion.addListener === "function" &&
          typeof reducedMotion.removeListener === "function") {
        try {
          reducedMotion.addListener(syncMotion);
          unsubscribe = () => reducedMotion.removeListener(syncMotion);
        } catch { /* Scroll/resize checks and the CSS guard remain available. */ }
      }
    }
    // These also re-check the preference when media-query change events are absent.
    window.addEventListener("pageshow", syncMotion);
    window.addEventListener("focus", syncMotion);
    syncMotion();
    return () => {
      try {
        unsubscribe();
      } catch { /* An unavailable media API must not prevent the remaining cleanup. */ }
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pageshow", syncMotion);
      window.removeEventListener("focus", syncMotion);
      if (frame !== null) cancelFrame(frame);
      restoreStatic();
    };
  }, []);
  return (
    <section
      ref={section}
      className="sound-story"
      aria-labelledby="sound-title"
    >
      <div className="sound-sticky">
        <div className="sound-heading">
          <span className="eyebrow">EL SONIDO TIENE OTRO COLOR</span>
          <h2 id="sound-title">
            Encuentra
            <br />
            <em>tu frecuencia.</em>
          </h2>
          <p>
            Tres formas de hacer una pausa.
            <br />
            Un diseño que habla de ti.
          </p>
          <Link className="button outline" href={`/producto/${product.slug}`}>
            Descubrir {product.name} <Icon name="arrow" />
          </Link>
        </div>
        <div className="sound-stage">
          <div className="sound-ring" aria-hidden="true" />
          <span className="sound-backtype" aria-hidden="true">
            PLAY
          </span>
          <div className="sound-composition">
            {[1, 2, 0].map((variant, index) => (
              <div
                className={`sound-product sound-product-${index}`}
                key={variant}
              >
                <Image
                  src={productImage(product, product.variantImages[variant])}
                  alt={`${product.name}, ${product.colors[variant]}`}
                  width={600}
                  height={600}
                  sizes="(max-width: 1100px) 37vw, 25vw"
                />
              </div>
            ))}
          </div>
          <div className="sound-colors" aria-label="Colores disponibles">
            {[1, 2, 0].map((variant, index) => (
              <span className={`sound-color-${index}`} key={variant}>
                {product.colors[variant]}
                <span className="sound-mobile-line" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
        <div className="sound-bottom">
          <span>DALE ESPACIO A LO QUE TE MUEVE.</span>
          <span className="scroll-track" aria-hidden="true">
            <i />
          </span>
          <span>{formatPrice(product.price)} COP</span>
        </div>
      </div>
    </section>
  );
}
