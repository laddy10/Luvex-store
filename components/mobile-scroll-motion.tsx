"use client";

import { useEffect } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function MobileScrollMotion() {
  useEffect(() => {
    const media = window.matchMedia("(max-width: 800px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;

    const update = () => {
      frame = 0;

      if (!media.matches || reducedMotion.matches) {
        document
          .querySelectorAll<HTMLElement>("[data-mobile-motion], [data-mobile-motion-card]")
          .forEach((element) => {
            element.style.removeProperty("--mobile-shift");
            element.style.removeProperty("--mobile-scale");
            element.style.removeProperty("--case-green-x");
            element.style.removeProperty("--case-green-y");
            element.style.removeProperty("--case-lilac-x");
            element.style.removeProperty("--case-lilac-y");
          });
        return;
      }

      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      const setProgress = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const progress = clamp(
          (viewportCenter - center) / (viewportHeight * 0.78),
          -1,
          1,
        );

        element.style.setProperty("--mobile-shift", `${progress * -10}px`);
        element.style.setProperty(
          "--mobile-scale",
          (1.02 + (progress + 1) * 0.0125).toFixed(4),
        );

        element.style.setProperty("--case-green-x", `${progress * -5}px`);
        element.style.setProperty("--case-green-y", `${progress * -8}px`);
        element.style.setProperty("--case-lilac-x", `${progress * 5}px`);
        element.style.setProperty("--case-lilac-y", `${progress * -11}px`);
      };

      document
        .querySelectorAll<HTMLElement>('[data-mobile-motion="catalog"] .product-card')
        .forEach((card) => {
          card.dataset.mobileMotionCard = "true";
          setProgress(card);
        });

      document
        .querySelectorAll<HTMLElement>(
          '[data-mobile-motion="playlist"], [data-mobile-motion="cases"]',
        )
        .forEach(setProgress);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    media.addEventListener("change", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      media.removeEventListener("change", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
    };
  }, []);

  return null;
}
