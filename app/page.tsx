import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { Catalog } from "@/components/catalog";
import { AirPodsMaxEditorialLab } from "@/components/airpods-max-editorial-lab";
import { Icon } from "@/components/icons";
import { products, formatPrice } from "@/lib/catalog";

export default function Home() {
  const max = products.find((p) => p.id === "P001")!;
  const pro = products.find((p) => p.id === "P002")!;
  const cases = products.filter((p) => p.category === "Fundas");
  return (
    <main id="contenido">
      <Hero product={max} />
      <div className="value-strip">
        <span>
          <Icon name="headphones" /> TU MÚSICA, TU ESPACIO
        </span>
        <span>
          <Icon name="phone" /> DETALLES QUE TE REPRESENTAN
        </span>
        <span>
          <Icon name="spark" /> TECNOLOGÍA PARA TODOS LOS DÍAS
        </span>
        <span className="strip-country">
          DESDE COLOMBIA, CONTIGO. <span className="colombia-dot" />
        </span>
      </div>
      <Catalog />
      <section
        className="editorial-pair section-space"
        aria-label="Explora por categoría"
      >
        <Link href={`/producto/${pro.slug}`} className="editorial-audio">
          <Image
            src={`${pro.folder}/AirPods-7.png`}
            alt="AirPods Pro 3 blancos sobre una superficie de mármol"
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
          <div className="editorial-overlay">
            <span className="eyebrow">PEQUEÑOS. MUY TUYOS.</span>
            <h2>
              Tu playlist.
              <br />A donde vayas.
            </h2>
            <span className="editorial-link">
              Descubre {pro.name}{" "}
              <span className="round-arrow">
                <Icon name="arrow-up" />
              </span>
            </span>
          </div>
          <span className="editorial-price">{formatPrice(pro.price)} COP</span>
        </Link>
        <Link href="/tienda?categoria=fundas" className="editorial-cases">
          <div className="editorial-overlay">
            <span className="eyebrow">UN CAMBIO QUE SE NOTA.</span>
            <h2>
              Un toque de color.
              <br />
              <em>Mucho de ti.</em>
            </h2>
            <span className="editorial-link">
              Encuentra tu funda{" "}
              <span className="round-arrow">
                <Icon name="arrow-up" />
              </span>
            </span>
          </div>
          <div className="case-composition">
            <Image
              className="composition-green"
              src="/products/studio/case-14-green.png"
              alt="Funda verde claro para iPhone 14"
              width={420}
              height={420}
              sizes="(max-width: 700px) 65vw, 30vw"
            />
            <Image
              className="composition-lilac"
              src="/products/studio/case-14pm-lilac.png"
              alt="Funda lila para iPhone 14 Pro Max"
              width={420}
              height={420}
              sizes="(max-width: 700px) 65vw, 30vw"
            />
          </div>
          <span className="editorial-price">
            DESDE {formatPrice(Math.min(...cases.map((p) => p.price)))} COP
          </span>
        </Link>
      </section>
      <AirPodsMaxEditorialLab />
      <div className="editorial-pro-transition" aria-hidden="true" />
      <section className="pro-feature" aria-labelledby="pro-feature-title">
        <div className="pro-feature-copy">
          <span className="eyebrow">TODO TU RITMO. EN POCO ESPACIO.</span>
          <h2 id="pro-feature-title">
            Tu mundo,
            <br />
            <em>en pequeño.</em>
          </h2>
          <p className="pro-feature-description">
            Un espacio para tu música. Un detalle para todos tus días.
          </p>
          <div className="pro-feature-details">
            <h3>{pro.name}</h3>
            <span>Color: {pro.colors[0]}</span>
            <p>
              {formatPrice(pro.price)} <small>COP</small>
            </p>
          </div>
          <Link className="button dark" href={`/producto/${pro.slug}`}>
            Descubrir {pro.name} <Icon name="arrow" />
          </Link>
        </div>
        <figure className="pro-feature-visual">
          <div className="pro-feature-photo">
            <Image
              src={`${pro.folder}/AirPods-12.png`}
              alt="AirPods Pro 3 blancos: estuche de carga abierto y auriculares sobre mármol"
              fill
              sizes="(max-width: 800px) 100vw, 56vw"
            />
          </div>
          <figcaption>
            <span>SONIDO EN SU MÍNIMA EXPRESIÓN.</span>
            <span>LUVEX / AUDIO</span>
          </figcaption>
        </figure>
      </section>
      <section className="help-strip">
        <Icon name="phone" width={30} height={30} />
        <div>
          <h3>Elige bien. Disfrútalo más.</h3>
          <p>
            Revisa el modelo de tu iPhone y encuentra la funda que le
            corresponde.
          </p>
        </div>
        <Link href="/ayuda" className="underlined-link">
          Antes de comprar <Icon name="arrow" width={18} />
        </Link>
      </section>
      <div id="universo" aria-hidden="true" />
    </main>
  );
}
