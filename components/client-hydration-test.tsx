"use client";

import { useEffect, useState } from "react";

export function ClientHydrationTest() {
  const [mounted, setMounted] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [ua, setUa] = useState("pendiente");
  const [error, setError] = useState("ninguno");

  useEffect(() => {
    setMounted(true);
    setUa(navigator.userAgent);

    const onScroll = () => setScrollY(Math.round(window.scrollY));
    const onError = (event: ErrorEvent) => {
      setError(event.message || "error de JavaScript sin mensaje");
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason ?? "promise rejection");
      setError(reason);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return (
    <section className="client-test-card">
      <h1>Client hydration test</h1>
      <p>
        Esta ruta no usa WebGL, Three.js ni animaciones complejas.
      </p>

      <dl>
        <div>
          <dt>SSR:</dt>
          <dd>VISIBLE</dd>
        </div>
        <div>
          <dt>React mounted:</dt>
          <dd>{mounted ? "YES" : "NO"}</dd>
        </div>
        <div>
          <dt>Button clicks:</dt>
          <dd>{clicks}</dd>
        </div>
        <div>
          <dt>scrollY:</dt>
          <dd>{scrollY}</dd>
        </div>
        <div>
          <dt>JS error:</dt>
          <dd>{error}</dd>
        </div>
        <div>
          <dt>User agent:</dt>
          <dd className="client-test-ua">{ua}</dd>
        </div>
      </dl>

      <button type="button" onClick={() => setClicks((value) => value + 1)}>
        Probar botón
      </button>

      <div className="client-test-spacer">
        Desplázate hasta aquí para comprobar si scrollY cambia.
      </div>
    </section>
  );
}
