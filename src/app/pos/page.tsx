import { AppShell } from "@/components/layout/app-shell";
import { requireAuth } from "@/lib/session";
import { getPosProducts } from "@/lib/services/products";
import { PosClient } from "./pos-client";

export const dynamic = "force-dynamic";

export default async function PosPage() {
  const user = await requireAuth();
  const rawProducts = await getPosProducts();

  const products = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    barcode: p.barcode,
    category: p.category,
    sellingPrice: p.sellingPrice,
    stock: p.stock,
    isActive: p.isActive,
  }));

  return (
    <AppShell userRole={user.role} userName={user.name}>
      <PosClient initialProducts={products} cashierName={user.name} />
    </AppShell>
  );
}
