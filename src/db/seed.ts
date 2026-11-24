import { db } from "./index";
import { products } from "./schema";
import { productSeed } from "./products-data";

export async function seedProducts() {
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .limit(1);

  if (existing.length > 0) return;

  await db.insert(products).values(productSeed);
  console.log(`[verde] seeded ${productSeed.length} products`);
}
