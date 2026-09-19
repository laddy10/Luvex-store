import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const base = process.env.TEST_BASE_URL || "http://localhost:3010";
const catalog = JSON.parse(
  readFileSync(new URL("../data/products.json", import.meta.url), "utf8"),
);
const homepage = await fetch(base).then((r) => r.text());
assert.match(homepage, /lang="es-CO"/);
assert.match(homepage, /GPT-6/);
assert.doesNotMatch(homepage, /case-pro-pending|Case Pro MagSafe/);
const shop = await fetch(`${base}/tienda`).then((r) => r.text());
const slugs = [
  ...new Set(
    [...shop.matchAll(/href="(\/producto\/[^"?]+)"/g)].map((match) => match[1]),
  ),
];
assert.equal(
  slugs.length,
  catalog.filter((p) => p.status === "confirmed").length,
);
for (const path of [
  "/",
  "/tienda",
  "/tienda?categoria=audio",
  "/tienda?categoria=fundas",
  "/ayuda",
  "/pedido",
  ...slugs,
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.doesNotMatch(html, /case-pro-pending|Case Pro MagSafe/, path);
  assert.match(html, /id="contenido"/, path);
  console.log(`PASS ${path}`);
}
for (const [category, expected] of [
  ["audio", 2],
  ["fundas", 5],
]) {
  const html = await fetch(`${base}/tienda?categoria=${category}`).then((r) =>
    r.text(),
  );
  assert.equal((html.match(/class="product-card"/g) || []).length, expected);
}
assert.equal((await fetch(`${base}/producto/case-pro-magsafe`)).status, 404);
assert.equal((await fetch(`${base}/pagina-inexistente`)).status, 404);
for (const image of [
  "/products/studio/case-14pm-lilac.png",
  "/products/headphones/headphones-max/headphones-max-1.png",
  "/products/airpods/airpods-pro/AirPods-2.jpeg",
]) {
  const response = await fetch(
    `${base}/_next/image?url=${encodeURIComponent(image)}&w=640&q=75`,
  );
  assert.equal(response.status, 200, image);
  assert.ok(response.headers.get("content-type").startsWith("image/"));
  assert.ok((await response.arrayBuffer()).byteLength > 1000);
}
console.log(
  "PASS category counts, unpublished product 404, missing page 404, image optimization",
);
