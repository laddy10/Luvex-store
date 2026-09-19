"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const FRAME_COUNT = 12;

function frameSrc(index: number) {
  const frame = String(index + 1).padStart(2, "0");
  return `/lab/airpods360/frame-${frame}.svg`;
}

export function AirPodsMax360Lab() {
  const sectionRef = useRef<HTMLElement>(null);
  const [frame, setFrame] = useState(0);
  const [reduced, setReduced] = useState(false);

  const frames = useMemo(
    () => Array.from({ length: FRAME_COUNT }, (_, index) => frameSrc(index)),
    [],
  );

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
        setFrame(0);
        section.style.setProperty("--lab360-progress", "0");
        return;
      }

      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / range));
      const nextFrame = Math.min(
        FRAME_COUNT - 1,
        Math.round(progress * (FRAME_COUNT - 1)),
      );

      setFrame(nextFrame);
      section.style.setProperty("--lab360-progress", String(progress));
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

  return (
    <section
      ref={sectionRef}
      className="lab360"
      aria-labelledby="lab360-title"
    >
      <div className="lab360-sticky">
        <div className="lab360-copy">
          <span className="lab360-kicker">LUVEX / 360 SEQUENCE PROTOTYPE</span>
          <h1 id="lab360-title">
            Un giro.
            <br />
            Una sola experiencia.
          </h1>
          <p>
            Secuencia de 12 frames controlada por scroll para validar la misma
            experiencia visual en desktop y móvil sin depender de WebGL.
          </p>

          <div className="lab360-meter" aria-hidden="true">
            <span />
          </div>

          <div className="lab360-status" aria-live="polite">
            FRAME {String(frame + 1).padStart(2, "0")} / {FRAME_COUNT}
            {reduced ? " · MOVIMIENTO REDUCIDO" : ""}
          </div>
        </div>

        <div className="lab360-stage" aria-label="Prototipo de giro 360">
          <div className="lab360-ring" aria-hidden="true" />
          <div className="lab360-word" aria-hidden="true">360°</div>

          <Image
            key={frames[frame]}
            src={frames[frame]}
            alt=""
            width={900}
            height={900}
            priority={frame === 0}
            className="lab360-frame"
            draggable={false}
          />

          <span className="lab360-index">01 / FRAME SEQUENCE STUDY</span>
        </div>
      </div>
    </section>
  );
}
