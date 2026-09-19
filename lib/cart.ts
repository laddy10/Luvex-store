import { products } from "./catalog";

export type CartItem = { id: string; color: string; quantity: number };
export const cartKey = (item: Pick<CartItem, "id" | "color">) =>
  `${item.id}:${item.color}`;

// Stored browser data is untrusted: always rehydrate against the confirmed catalog.
export function validateCart(input: unknown): CartItem[] {
  if (!Array.isArray(input)) return [];
  const merged = new Map<string, CartItem>();
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const product = products.find((p) => p.id === item.id);
    if (
      !product ||
      !product.colors.includes(item.color) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    )
      continue;
    const key = cartKey(item);
    merged.set(key, {
      id: item.id,
      color: item.color,
      quantity: Math.min(99, item.quantity + (merged.get(key)?.quantity ?? 0)),
    });
  }
  return [...merged.values()];
}

export function cartTotal(items: CartItem[]) {
  return items.reduce(
    (total, item) =>
      total +
      (products.find((p) => p.id === item.id)?.price ?? 0) * item.quantity,
    0,
  );
}
