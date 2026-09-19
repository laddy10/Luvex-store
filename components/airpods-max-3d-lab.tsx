"use client";

import { useEffect, useRef } from "react";

type ModelViewerElement = HTMLElement & {
  cameraOrbit?: string;
  jumpCameraToGoal?: () => void;
};

const TEMP_MODEL =
  "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb";

export function AirPodsMax3DLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewerRef = useRef<ModelViewerElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewer = viewerRef.current;
    if (!section || !viewer) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let frame = 0;

    const render = () => {
      frame = 0;

      if (reducedMotion.matches) {
        viewer.cameraOrbit = "0deg 75deg 105%";
        viewer.setAttribute("camera-orbit", "0deg 75deg 105%");
        viewer.jumpCameraToGoal?.();
        section.style.setProperty("--lab-progress", "0");
        return;
      }

      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / range));

      // Rotate a single intact 3D object through the scroll journey.
      const azimuth = -70 + progress * 220;
      const polar = 76 - Math.sin(progress * Math.PI) * 7;
      const radius = 108 - Math.sin(progress * Math.PI) * 8;

      const orbit = `${azimuth.toFixed(2)}deg ${polar.toFixed(2)}deg ${radius.toFixed(2)}%`;
      viewer.cameraOrbit = orbit;
      viewer.setAttribute("camera-orbit", orbit);
      viewer.jumpCameraToGoal?.();

      section.style.setProperty("--lab-progress", String(progress));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    const onMotionChange = () => schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener?.("change", onMotionChange);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener?.("change", onMotionChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="lab3d" aria-labelledby="lab3d-title">
      <div className="lab3d-sticky">
        <div className="lab3d-copy">
          <span className="lab3d-kicker">LUVEX / 3D PROTOTYPE</span>
          <h1 id="lab3d-title">
            Un objeto.
            <br />
            Todos sus ángulos.
          </h1>
          <p>
            Laboratorio aislado para validar scroll + GLB en desktop y móvil
            antes de tocar SoundStory.
          </p>
          <div className="lab3d-meter" aria-hidden="true">
            <span />
          </div>
          <small>
            Modelo temporal de prueba. Se reemplazará por AirPods Max cuando
            tengamos el GLB final.
          </small>
        </div>

        <div className="lab3d-viewer-shell">
          {/*
            We deliberately use a temporary public GLB only to validate the
            rendering and scroll pipeline. No homepage code depends on this.
          */}
          {/** @ts-expect-error Custom element provided by model-viewer at runtime. */}
          <model-viewer
            ref={(node: ModelViewerElement | null) => {
              viewerRef.current = node;
            }}
            src={TEMP_MODEL}
            alt="Modelo 3D temporal para validar el laboratorio de LUVEX"
            camera-orbit="-70deg 76deg 108%"
            min-camera-orbit="auto 55deg 90%"
            max-camera-orbit="auto 90deg 125%"
            field-of-view="28deg"
            exposure="1"
            shadow-intensity="0.7"
            shadow-softness="0.8"
            interaction-prompt="none"
            touch-action="pan-y"
            loading="lazy"
            reveal="auto"
          />
          <span className="lab3d-axis lab3d-axis-x">X</span>
          <span className="lab3d-axis lab3d-axis-y">Y</span>
          <span className="lab3d-index">01 / ROTATION STUDY</span>
        </div>
      </div>
    </section>
  );
}
