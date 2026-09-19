import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import catalogModule from "../.work/tests/lib/catalog.js";
import cartModule from "../.work/tests/lib/cart.js";

const { products, productImage, formatPrice } = catalogModule;
const { validateCart, cartTotal, cartKey } = cartModule;
const source = JSON.parse(
  readFileSync(new URL("../data/products.json", import.meta.url), "utf8"),
);

test("every confirmed product is published, pending products remain excluded", () => {
  assert.deepEqual(
    products.map((p) => p.id),
    source.filter((p) => p.status === "confirmed").map((p) => p.id),
  );
  assert.ok(products.every((p) => p.status === "confirmed" && p.price > 0));
  for (const p of products) {
    const original = source.find((item) => item.id === p.id);
    for (const key of ["name", "price", "currency", "colors", "folder"])
      assert.deepEqual(p[key], original[key]);
  }
  assert.equal(new Set(products.map((p) => p.slug)).size, products.length);
});

test("all colors have corresponding images and every image exists", () => {
  for (const p of products) {
    assert.equal(p.variantImages.length, p.colors.length, p.name);
    for (const src of [...p.images, ...p.variantImages]) {
      const path = productImage(p, src);
      assert.ok(!path.includes("pending"));
      assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), path);
    }
  }
});

test("COP display uses Colombian thousands separators", () => {
  assert.equal(formatPrice(130000), "$130.000");
  assert.equal(formatPrice(12000), "$12.000");
  assert.equal(formatPrice(0), "$0");
});

test("untrusted cart data cannot introduce pending products, prices or invalid colors", () => {
  const dirty = [
    null,
    false,
    5,
    {},
    { id: "P008", color: "Negro", quantity: 1 },
    { id: "P001", color: "Rosa", quantity: 1 },
    { id: "P001", color: "Negro", quantity: -1 },
    { id: "P001", color: "Negro", quantity: 1.5 },
    { id: "P001", color: "Negro", quantity: "2" },
    { id: "P001", color: "Negro", quantity: 2, price: 1 },
  ];
  assert.deepEqual(validateCart(dirty), [
    { id: "P001", color: "Negro", quantity: 2 },
  ]);
  assert.equal(cartTotal(validateCart(dirty)), 260000);
  assert.deepEqual(validateCart({}), []);
});

test("duplicates merge by product AND color; quantities stay bounded", () => {
  const items = validateCart([
    { id: "P001", color: "Verde", quantity: 2 },
    { id: "P001", color: "Verde", quantity: 3 },
    { id: "P001", color: "Negro", quantity: 1 },
    { id: "P002", color: "Blanco", quantity: 999 },
  ]);
  assert.equal(items.length, 3);
  assert.equal(items[0].quantity, 5);
  assert.equal(items[2].quantity, 99);
  assert.notEqual(cartKey(items[0]), cartKey(items[1]));
});

test("mixed cart subtotal, removal and price changes use catalog values", () => {
  const items = validateCart([
    { id: "P001", color: "Negro", quantity: 1 },
    { id: "P006", color: "Lila/Morado claro", quantity: 2 },
  ]);
  assert.equal(cartTotal(items), 154000);
  assert.deepEqual(
    validateCart(items.map((item) => ({ ...item, quantity: 0 }))),
    [],
  );
  assert.equal(cartTotal([]), 0);
});
