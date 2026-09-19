"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

function LabObject({ progress }: { progress: number }) {
  const y = -1.15 + progress * 3.8;
  const x = 0.18 + Math.sin(progress * Math.PI) * 0.22;

  return (
    <mesh rotation={[x, y, 0.08]}>
      <boxGeometry args={[2.6, 2.6, 2.6]} />
      <meshStandardMaterial
        color="#66715f"
        metalness={0.35}
        roughness={0.28}
      />
    </mesh>
  );
}

export function AirPodsMax3DLab() {
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".lab3d");
    if (!section) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const render = () => {
      frame = 0;
      const shouldReduce = media.matches;
      setReduced(shouldReduce);

      if (shouldReduce) {
        setProgress(0);
        section.style.setProperty("--lab-progress", "0");
        return;
      }

      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const next = Math.max(0, Math.min(1, -rect.top / range));

      setProgress(next);
      section.style.setProperty("--lab-progress", String(next));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener?.("change", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener?.("change", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="lab3d" aria-labelledby="lab3d-title">
      <div className="lab3d-sticky">
        <div className="lab3d-copy">
          <span className="lab3d-kicker">LUVEX / R3F PROTOTYPE</span>
          <h1 id="lab3d-title">
            Un objeto.
            <br />
            Todos sus ángulos.
          </h1>
          <p>
            Prueba aislada con React Three Fiber local para validar WebGL +
            scroll en desktop y móvil antes de tocar SoundStory.
          </p>
          <div className="lab3d-meter" aria-hidden="true">
            <span />
          </div>
          <small>
            Geometría temporal. Si funciona en el teléfono, el siguiente paso
            será cargar un GLB real de AirPods Max.
          </small>
        </div>

        <div className="lab3d-viewer-shell">
          <Canvas
            className="lab3d-canvas"
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 6.4], fov: 35 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            frameloop="demand"
          >
            <ambientLight intensity={1.6} />
            <directionalLight position={[4, 6, 5]} intensity={3} />
            <directionalLight position={[-4, -2, 2]} intensity={1.2} />
            <LabObject progress={reduced ? 0 : progress} />
          </Canvas>

          <span className="lab3d-axis lab3d-axis-x">X</span>
          <span className="lab3d-axis lab3d-axis-y">Y</span>
          <span className="lab3d-index">01 / LOCAL WEBGL STUDY</span>
        </div>
      </div>
    </section>
  );
}
