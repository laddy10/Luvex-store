# LUVEX

Tienda de accesorios de tecnología para Colombia, construida con Next.js 16.3.5, React 19 y TypeScript. Diseño editorial en marfil, grafito y verde salvia inspirado en la identidad original de LUVEX. Todos los precios se muestran en COP.

## Ejecutar

```sh
npm install
npm run dev
```

Abrir **http://localhost:3010**. Se usa el puerto 3010 porque otros proyectos ya ocupan el 3000 y el 3001. En PowerShell con ejecución de scripts restringida, usar `npm.cmd` en lugar de `npm`.

```sh
npm run lint
npm test
npm run build
npm run start
```

Con el servidor iniciado, `npm run test:routes` comprueba las rutas, las categorías, las páginas 404 y la optimización de imágenes. `TEST_BASE_URL` permite elegir otro servidor de pruebas.

## Experiencia

- Portada con selector de color de AirPods Max y composición dimensional que responde al desplazamiento.
- `/tienda`: filtros por categoría y modelo de iPhone, búsqueda y orden por precio.
- `/producto/[slug]`: siete fichas con colores, galerías, ampliación y productos relacionados.
- Bolsa lateral con cantidades, eliminación, subtotal y persistencia local entre visitas. Sincronización entre pestañas.
- `/pedido`: revisión y descarga de la selección; enlace a WhatsApp cuando se configura el canal real.
- `/ayuda`: guía de compatibilidad, explicación del pedido y privacidad.
- Diálogos nativos con foco contenido, cierre con Escape, enlaces de salto, etiquetas accesibles, diseño adaptable y soporte para movimiento reducido.

La animación utiliza fotografías reales con transformaciones CSS en profundidad, rotación y desplazamiento; no representa un modelo geométrico 3D ni inventa componentes internos del producto. No usa librerías de animación adicionales.

## Catálogo e imágenes

`data/products.json` es la fuente de verdad para nombre, precio, moneda, colores, carpeta y estado. `lib/catalog.ts` añade exclusivamente información de presentación y asociaciones de fotografías. Solo se publican productos con `status: "confirmed"`, precio numérico y presentación definida. No se publica `P008`.

Para agregar un producto: incorporar sus datos confirmados al JSON, añadir sus imágenes a `public/products`, definir su presentación en `lib/catalog.ts` y ejecutar las pruebas. No se mantienen precios duplicados.

Se conservan las imágenes originales. Las siete imágenes nuevas están en `public/products/studio/`. Las referencias, las instrucciones exactas y la herramienta utilizada están documentadas en [docs/image-provenance.json](docs/image-provenance.json). Las fotos originales permanecen disponibles en las galerías.

Las fuentes Geist se sirven localmente mediante `next/font/local`; no se necesita Google Fonts para compilar ni para visitar la tienda. Los archivos se copiaron sin modificar desde la distribución instalada de Next.js. Licencia en `app/fonts/OFL.txt`; [fuente oficial](https://github.com/vercel/geist-font).

## Activar pedidos reales

Copiar `.env.example` a `.env.local` y completar:

```dotenv
NEXT_PUBLIC_SITE_URL=https://DOMINIO_REAL
LUVEX_WHATSAPP=NUMERO_REAL_CON_CODIGO_DE_PAIS
```

`LUVEX_WHATSAPP` debe tener solo dígitos, entre 10 y 15 caracteres, sin `+` ni espacios. Se lee en el servidor. Reiniciar el desarrollo o volver a compilar después de configurarlo. La página de pedido habilitará “Continuar por WhatsApp” con productos, colores, cantidades, subtotal y los datos opcionales del comprador.

**Estado actual:** no se proporcionó el canal comercial ni una pasarela de pago. La tienda permite preparar y descargar la selección; no envía pedidos, no procesa pagos, no reserva existencias ni afirma que una compra se haya completado. El cliente debe confirmar cobertura, costo del envío, inventario, especificaciones y condiciones comerciales antes del lanzamiento. No se inventaron políticas, testimonios, descuentos ni especificaciones técnicas.

Para cobro directo se requiere una integración adicional de pagos, verificación de importes en servidor, webhooks y persistencia de pedidos. Un enlace de WhatsApp no es una pasarela de pago.

## Archivos

| Ruta | Responsabilidad |
| --- | --- |
| `app/page.tsx`, `app/globals.css`, `app/layout.tsx` | Portada, sistema visual, tipografías y metadatos |
| `app/tienda/page.tsx` | Colección y categoría inicial desde URL |
| `app/producto/[slug]/page.tsx` | Páginas individuales y generación estática |
| `app/pedido/page.tsx`, `app/ayuda/page.tsx`, `app/not-found.tsx` | Pedido, ayuda y página 404 |
| `components/header.tsx`, `footer.tsx`, `icons.tsx` | Navegación, búsqueda, marca y elementos compartidos |
| `components/hero.tsx`, `catalog.tsx`, `product-card.tsx`, `product-detail.tsx` | Presentación e interacción con el catálogo |
| `components/store-provider.tsx`, `order-review.tsx` | Estado de la bolsa y revisión del pedido |
| `lib/catalog.ts`, `lib/cart.ts` | Catálogo publicado, formatos, validación y cálculo |
| `tests/catalog-cart.test.mjs`, `scripts/check-routes.mjs` | Pruebas de negocio y verificación HTTP |
| `app/fonts/` | Tipografías locales y licencia |
| `public/products/studio/`, `docs/image-provenance.json` | Imágenes de estudio y trazabilidad |
| `.env.example`, `package.json`, `.gitignore`, `eslint.config.mjs` | Configuración y comandos |

Se retiró el favicon de Next.js y se utiliza la imagen oficial de LUVEX. El catálogo y las fotografías originales del cliente no se modificaron. No se añadieron dependencias de ejecución.

## Verificación de entrega

- Compilación de producción y análisis TypeScript correctos.
- ESLint sin errores ni advertencias.
- Seis pruebas del catálogo y la bolsa: publicación, precios, integridad de las imágenes, datos inválidos, variantes y subtotales.
- Trece rutas HTTP correctas; filtros de audio/fundas, producto pendiente excluido, página 404 e imágenes optimizadas verificados.
- Las siete imágenes generadas se revisaron visualmente.
- **Limitación:** la revisión visual e interactiva de escritorio/móvil quedó pendiente. Computer Use detuvo la sesión porque no pudo identificar con confianza la URL actual del navegador en Windows. Las comprobaciones HTTP no sustituyen esa revisión.

Modelo identificado en esta sesión: GPT-6 / Codex, indicado también en el banner superior. Tiempo aproximado de ejecución creativa y técnica: 40 minutos.
