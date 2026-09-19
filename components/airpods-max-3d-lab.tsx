"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function AirPodsMaxModel({ progress }: { progress: number }) {
  const gltf = useLoader(GLTFLoader, "/models/airpods-max.glb");

  const prepared = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = 3.25 / maxDimension;

    scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          if (
            material instanceof THREE.MeshStandardMaterial ||
            material instanceof THREE.MeshPhysicalMaterial
          ) {
            material.envMapIntensity = 0.65;
            material.needsUpdate = true;
          }
        });
      }
    });

    return { scene, center, scale };
  }, [gltf.scene]);

  // One intact product, rotating through a controlled campaign-style arc.
  const rotationY = -0.72 + progress * Math.PI * 1.55;
  const rotationX = 0.02 + Math.sin(progress * Math.PI) * 0.08;

  return (
    <group
      rotation={[rotationX, rotationY, 0]}
      scale={prepared.scale}
      position={[0, 0.08, 0]}
    >
      <primitive
        object={prepared.scene}
        position={[
          -prepared.center.x,
          -prepared.center.y,
          -prepared.center.z,
        ]}
      />
    </group>
  );
}

function ModelLoadingFallback() {
  return (
    <mesh>
      <ringGeometry args={[1.05, 1.09, 64]} />
      <meshBasicMaterial color="#87917d" transparent opacity={0.35} />
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
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight || 1;
      const range = Math.max(1, rect.height - viewportHeight);
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
          <span className="lab3d-kicker">LUVEX / AIRPODS MAX 3D STUDY</span>
          <h1 id="lab3d-title">
            Un objeto.
            <br />
            Todos sus ángulos.
          </h1>
          <p>
            Un solo AirPods Max completo, iluminado como producto editorial y
            rotado por el scroll.
          </p>
          <div className="lab3d-meter" aria-hidden="true">
            <span />
          </div>
          <small>
            Prototipo visual aislado. La homepage y SoundStory siguen intactas.
          </small>
        </div>

        <div className="lab3d-viewer-shell">
          <Canvas
            className="lab3d-canvas"
            dpr={[1, 1.75]}
            camera={{ position: [0, 0.15, 7.2], fov: 29 }}
            shadows
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 0.82;
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }}
          >
            <hemisphereLight
              args={["#f5f1e8", "#596253", 0.85]}
              position={[0, 4, 0]}
            />
            <ambientLight intensity={0.22} />

            <directionalLight
              position={[4.5, 6, 5]}
              intensity={1.55}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <directionalLight
              position={[-4, 2.5, 3]}
              intensity={0.5}
              color="#dce4d6"
            />
            <directionalLight
              position={[1, 2, -5]}
              intensity={0.38}
              color="#ffffff"
            />

            <Suspense fallback={<ModelLoadingFallback />}>
              <AirPodsMaxModel progress={reduced ? 0 : progress} />
            </Suspense>

            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1.78, 0]}
              receiveShadow
            >
              <planeGeometry args={[8, 8]} />
              <shadowMaterial transparent opacity={0.16} />
            </mesh>
          </Canvas>

          <span className="lab3d-axis lab3d-axis-x">X</span>
          <span className="lab3d-axis lab3d-axis-y">Y</span>
          <span className="lab3d-index">01 / AIRPODS MAX GLB STUDY</span>
        </div>
      </div>
    </section>
  );
}
