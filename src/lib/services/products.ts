import { db } from "@/lib/db";
import { z } from "zod";

export const ProductInputSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  sku: z.string().min(2, "SKU minimal 2 karakter"),
  barcode: z.string().nullable().optional(),
  category: z.string().min(1, "Kategori wajib dipilih"),
  purchasePrice: z.number().int().min(0, "Harga beli minimal 0"),
  sellingPrice: z.number().int().min(0, "Harga jual minimal 0"),
  stock: z.number().int().min(0, "Stok awal tidak boleh negatif"),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof ProductInputSchema>;

export async function getPosProducts(search?: string, category?: string) {
  try {
    const whereClause: Record<string, unknown> = {
      isActive: true,
    };

    if (category && category !== "all" && category !== "Semua Produk") {
      whereClause.category = category;
    }

    if (search && search.trim().length > 0) {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        { barcode: { contains: q, mode: "insensitive" } },
      ];
    }

    return await db.product.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching POS products:", error);
    return [];
  }
}

export async function getAllProductsList(
  search?: string,
  category?: string,
  status?: string
) {
  try {
    const whereClause: Record<string, unknown> = {};

    if (category && category !== "all") {
      whereClause.category = category;
    }

    if (status === "Aman") {
      whereClause.stock = { gt: 5 };
    } else if (status === "Rendah") {
      whereClause.stock = { lte: 5, gt: 0 };
    } else if (status === "Habis") {
      whereClause.stock = 0;
    }

    if (search && search.trim().length > 0) {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        { barcode: { contains: q, mode: "insensitive" } },
      ];
    }

    return await db.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching catalog products:", error);
    return [];
  }
}
