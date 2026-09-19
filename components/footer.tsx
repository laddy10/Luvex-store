import Link from "next/link";
import { Icon } from "./icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <span className="eyebrow">EL DETALLE HACE LA DIFERENCIA.</span>
          <h2>
            Hazlo <em>muy tuyo.</em>
          </h2>
          <Link href="/tienda" className="footer-cta">
            Encuentra tu próximo favorito <Icon name="arrow-up" />
          </Link>
        </div>
        <div className="footer-links">
          <div>
            <h3>Explora</h3>
            <Link href="/tienda">Toda la colección</Link>
            <Link href="/tienda?categoria=audio">Audio</Link>
            <Link href="/tienda?categoria=fundas">Fundas para iPhone</Link>
          </div>
          <div>
            <h3>LUVEX</h3>
            <Link href="/#universo">Nuestro universo</Link>
            <Link href="/ayuda">Antes de comprar</Link>
            <Link href="/pedido">Mi pedido</Link>
          </div>
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        LUVEX<span>CO</span>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} LUVEX · Accesorios de tecnología
        </span>
        <span>
          Colombia <span className="colombia-dot" /> Precios en COP
        </span>
        <Link href="/ayuda#privacidad">Privacidad</Link>
      </div>
    </footer>
  );
}
