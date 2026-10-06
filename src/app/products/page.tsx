import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/session";
import { getAllProductsList } from "@/lib/services/products";
import { ProductsClient } from "./products-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const user = await requireRole(["ADMIN"]);
  const rawProducts = await getAllProductsList();

  const products = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    barcode: p.barcode,
    category: p.category,
    purchasePrice: p.purchasePrice,
    sellingPrice: p.sellingPrice,
    stock: p.stock,
    isActive: p.isActive,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <AppShell userRole={user.role} userName={user.name}>
      <ProductsClient initialProducts={products} />
    </AppShell>
  );
}
