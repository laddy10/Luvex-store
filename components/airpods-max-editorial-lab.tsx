"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    src: "/products/headphones/headphones-max/headphones-max-green-cutout.png",
    label: "VERDE",
    eyebrow: "01 / TU PAUSA",
    title: "Haz espacio\npara tu sonido.",
    body: "Un color sereno. Una presencia que se siente sin pedir permiso.",
  },
  {
    src: "/products/headphones/headphones-max/headphones-max-silver-cutout.png",
    label: "GRIS / PLATA",
    eyebrow: "02 / TU RITMO",
    title: "Menos ruido.\nMás tú.",
    body: "Una composición limpia para dejar que el producto hable por sí solo.",
  },
  {
    src: "/products/headphones/headphones-max/headphones-max-black-cutout.png",
    label: "NEGRO",
    eyebrow: "03 / TU ESTILO",
    title: "Cierra el mundo.\nEntra en el tuyo.",
    body: "Un cierre más profundo para terminar la historia con contraste y presencia.",
  },
] as const;

export function AirPodsMaxEditorialLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const update = () => {
      raf = 0;
      const shouldReduce = media.matches;
      setReduced(shouldReduce);

      if (shouldReduce) {
        setProgress(0);
        section.style.setProperty("--editorial-progress", "0");
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight || 1;
      const range = Math.max(1, rect.height - viewportHeight);
      const next = Math.max(0, Math.min(1, -rect.top / range));

      setProgress(next);
      section.style.setProperty("--editorial-progress", String(next));
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener?.("change", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener?.("change", schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const rawIndex = Math.min(
    slides.length - 1,
    Math.floor(progress * slides.length),
  );
  const activeIndex = reduced ? 0 : rawIndex;
  const localProgress = reduced
    ? 0
    : Math.min(1, Math.max(0, progress * slides.length - activeIndex));
  const active = slides[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="editorial-lab"
      aria-labelledby="editorial-lab-title"
    >
      <div className="editorial-lab-sticky">
        <div className="editorial-lab-copy">
          <div className="editorial-lab-copy-state" key={active.label}>
            <span className="editorial-lab-eyebrow">{active.eyebrow}</span>

            <h1 id="editorial-lab-title">
              {active.title.split("\n").map((line, index) => (
                <span key={line}>
                  {line}
                  {index === 0 ? <br /> : null}
                </span>
              ))}
            </h1>

            <p>{active.body}</p>

            <div className="editorial-lab-meta">
              <span>{active.label}</span>
              <span>AirPods Max</span>
            </div>

            <Link className="editorial-lab-cta" href="/producto/airpods-max">
              Descubrir AirPods Max <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="editorial-lab-stage">
          <div className="editorial-lab-orbit orbit-a" aria-hidden="true" />
          <div className="editorial-lab-orbit orbit-b" aria-hidden="true" />
          <span className="editorial-lab-backtype" aria-hidden="true">
            MAX
          </span>

          <div
            className="editorial-lab-product"
            style={{
              transform: reduced
                ? "translate3d(-50%, -50%, 0)"
                : `translate3d(calc(-50% + ${(localProgress - 0.5) * 56}px), calc(-50% + ${Math.sin(localProgress * Math.PI) * -18}px), 0) rotate(${(localProgress - 0.5) * 4}deg) scale(${1.02 + Math.sin(localProgress * Math.PI) * 0.06})`,
            }}
          >
            {slides.map((slide, index) => {
              const distance = Math.abs(index - activeIndex);
              return (
                <Image
                  key={slide.src}
                  src={slide.src}
                  alt={
                    index === activeIndex
                      ? `AirPods Max en color ${slide.label.toLowerCase()}`
                      : ""
                  }
                  aria-hidden={index !== activeIndex}
                  width={900}
                  height={900}
                  sizes="(max-width: 800px) 90vw, 56vw"
                  priority={index === 0}
                  className={index === activeIndex ? "is-active" : ""}
                  style={{
                    opacity: distance === 0 ? 1 : 0,
                    transform:
                      distance === 0
                        ? `scale(${1 + Math.sin(localProgress * Math.PI) * 0.025})`
                        : "scale(0.96)",
                  }}
                />
              );
            })}
          </div>

          <div className="editorial-lab-colors" aria-label="Colores disponibles">
            {slides.map((slide, index) => (
              <span
                key={slide.label}
                className={index === activeIndex ? "is-active" : ""}
              >
                {slide.label}
              </span>
            ))}
          </div>

          <span className="editorial-lab-index" aria-hidden="true">
            0{activeIndex + 1} / 03
          </span>
        </div>

        <div className="editorial-lab-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
