"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

type Diagnostics = {
  webgl: boolean;
  webgl2: boolean;
  renderer: string;
  canvas: string;
  contextLost: boolean;
  triangleDrawn: boolean;
};

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
    const scale = 3.6 / maxDimension;

    scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    return { scene, center, scale };
  }, [gltf.scene]);

  const rotationY = -0.95 + progress * Math.PI * 1.75;
  const rotationX = 0.03 + Math.sin(progress * Math.PI) * 0.12;

  return (
    <group
      rotation={[rotationX, rotationY, 0]}
      scale={prepared.scale}
      position={[0, -0.05, 0]}
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
      <ringGeometry args={[1.1, 1.14, 64]} />
      <meshBasicMaterial color="#87917d" transparent opacity={0.45} />
    </mesh>
  );
}

function drawDiagnosticTriangle(
  canvas: HTMLCanvasElement,
  gl: WebGLRenderingContext | WebGL2RenderingContext,
) {
  const vertexSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(0.20, 0.28, 0.16, 1.0);
    }
  `;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || "shader compile");
    }
    return shader;
  };

  const program = gl.createProgram();
  if (!program) throw new Error("program");

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "program link");
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-0.82, -0.72, 0.82, -0.72, 0, 0.82]),
    gl.STATIC_DRAW,
  );

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.93, 0.94, 0.90, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  const location = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.deleteBuffer(buffer);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  gl.deleteProgram(program);
}

export function AirPodsMax3DLab() {
  const diagnosticCanvas = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [diagnostics, setDiagnostics] = useState<Diagnostics>({
    webgl: false,
    webgl2: false,
    renderer: "pendiente",
    canvas: "pendiente",
    contextLost: false,
    triangleDrawn: false,
  });

  useEffect(() => {
    const canvas = diagnosticCanvas.current;
    if (!canvas) return;

    const webglCanvas = document.createElement("canvas");
    const webgl2Canvas = document.createElement("canvas");
    const webgl = !!webglCanvas.getContext("webgl");
    const webgl2 = !!webgl2Canvas.getContext("webgl2");

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl") as WebGLRenderingContext | null);

    let renderer = "sin contexto";
    let triangleDrawn = false;

    if (gl) {
      try {
        const debug = gl.getExtension("WEBGL_debug_renderer_info");
        renderer = debug
          ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL))
          : String(gl.getParameter(gl.RENDERER));
        drawDiagnosticTriangle(canvas, gl);
        triangleDrawn = true;
      } catch (error) {
        renderer = `error: ${
          error instanceof Error ? error.message : "desconocido"
        }`;
      }
    }

    const onLost = (event: Event) => {
      event.preventDefault();
      setDiagnostics((current) => ({ ...current, contextLost: true }));
    };

    canvas.addEventListener("webglcontextlost", onLost, false);

    setDiagnostics({
      webgl,
      webgl2,
      renderer,
      canvas: `${canvas.width} × ${canvas.height} (DPR ${dpr.toFixed(1)})`,
      contextLost: false,
      triangleDrawn,
    });

    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, []);

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
          <span className="lab3d-kicker">LUVEX / AIRPODS MAX GLB TEST</span>
          <h1 id="lab3d-title">
            Un objeto.
            <br />
            Todos sus ángulos.
          </h1>
          <p>
            Validación del AirPods Max real en GLB, con el giro controlado por
            el mismo progreso de scroll.
          </p>
          <div className="lab3d-meter" aria-hidden="true">
            <span />
          </div>
          <small>
            Modelo cargado desde /public/models/airpods-max.glb. La homepage y
            SoundStory siguen intactas.
          </small>
        </div>

        <div className="lab3d-viewer-shell">
          <Canvas
            className="lab3d-canvas"
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 6.4], fov: 35 }}
            shadows
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            frameloop="demand"
          >
            <ambientLight intensity={1.35} />
            <directionalLight position={[4, 6, 5]} intensity={3.2} castShadow />
            <directionalLight position={[-4, 1, 3]} intensity={1.45} />
            <directionalLight position={[0, -3, -4]} intensity={0.8} />

            <Suspense fallback={<ModelLoadingFallback />}>
              <AirPodsMaxModel progress={reduced ? 0 : progress} />
            </Suspense>
          </Canvas>

          <div className="lab3d-diagnostic">
            <strong>AIRPODS MAX / WEBGL</strong>
            <span>WebGL: {diagnostics.webgl ? "OK" : "ERROR"}</span>
            <span>WebGL2: {diagnostics.webgl2 ? "OK" : "ERROR"}</span>
            <span>Triangle: {diagnostics.triangleDrawn ? "OK" : "ERROR"}</span>
            <span>Canvas: {diagnostics.canvas}</span>
            <span>Context lost: {diagnostics.contextLost ? "YES" : "NO"}</span>
            <span className="lab3d-renderer">{diagnostics.renderer}</span>
            <canvas
              ref={diagnosticCanvas}
              className="lab3d-pure-webgl"
              aria-label="Prueba WebGL pura"
            />
          </div>

          <span className="lab3d-axis lab3d-axis-x">X</span>
          <span className="lab3d-axis lab3d-axis-y">Y</span>
          <span className="lab3d-index">01 / AIRPODS MAX GLB STUDY</span>
        </div>
      </div>
    </section>
  );
}
