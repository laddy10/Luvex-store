import Link from "next/link";
import { Icon } from "@/components/icons";
export default function NotFound() {
  return (
    <main id="contenido" className="not-found">
      <span className="eyebrow">404 / FUERA DE FRECUENCIA</span>
      <h1>
        Por aquí no era.
        <br />
        <em>Lo tuyo está cerca.</em>
      </h1>
      <p>
        Esta página no está disponible. Explora nuestra colección y encuentra tu
        próximo favorito.
      </p>
      <Link className="button dark" href="/tienda">
        Volver a la colección <Icon name="arrow" />
      </Link>
    </main>
  );
}
