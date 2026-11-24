export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { seedProducts } = await import("./db/seed");
      await seedProducts();
    } catch (err) {
      // The DB may not be migrated yet on first boot — never block startup.
      console.warn("[verde] seed skipped:", err);
    }
  }
}
