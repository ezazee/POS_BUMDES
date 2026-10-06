import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ProductInputSchema } from "@/lib/services/products";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;

    const whereClause: Record<string, unknown> = {};
    if (category && category !== "all") {
      whereClause.category = category;
    }
    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        { barcode: { contains: q, mode: "insensitive" } },
      ];
    }

    const products = await db.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data produk." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Hanya Admin yang dapat menambah produk." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = ProductInputSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const { name, sku, barcode, category, purchasePrice, sellingPrice, stock, isActive } = parsed.data;

    // Check duplicate SKU
    const existingSku = await db.product.findUnique({
      where: { sku: sku.trim() },
    });
    if (existingSku) {
      return NextResponse.json(
        { success: false, message: `SKU "${sku}" sudah terdaftar pada produk lain.` },
        { status: 400 }
      );
    }

    // Check duplicate Barcode if provided
    const cleanBarcode = barcode?.trim() || null;
    if (cleanBarcode) {
      const existingBarcode = await db.product.findUnique({
        where: { barcode: cleanBarcode },
      });
      if (existingBarcode) {
        return NextResponse.json(
          { success: false, message: `Barcode "${cleanBarcode}" sudah terdaftar.` },
          { status: 400 }
        );
      }
    }

    const created = await db.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          name: name.trim(),
          sku: sku.trim(),
          barcode: cleanBarcode,
          category: category.trim(),
          purchasePrice,
          sellingPrice,
          stock,
          isActive,
        },
      });

      if (stock > 0) {
        await tx.stockMovement.create({
          data: {
            productId: p.id,
            type: "MANUAL",
            quantity: stock,
            stockBefore: 0,
            stockAfter: stock,
            note: "Stok awal produk baru",
          },
        });
      }

      return p;
    });

    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/products error:", error);
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan internal.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
