import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ProductInputSchema } from "@/lib/services/products";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Hanya Admin yang dapat mengedit produk." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = ProductInputSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const { name, sku, barcode, category, purchasePrice, sellingPrice, stock, isActive } = parsed.data;

    // Verify existing product
    const existing = await db.product.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    // Check duplicate SKU if changed
    if (sku.trim() !== existing.sku) {
      const skuConflict = await db.product.findUnique({
        where: { sku: sku.trim() },
      });
      if (skuConflict && skuConflict.id !== id) {
        return NextResponse.json(
          { success: false, message: `SKU "${sku}" sudah digunakan produk lain.` },
          { status: 400 }
        );
      }
    }

    // Check duplicate barcode if changed
    const cleanBarcode = barcode?.trim() || null;
    if (cleanBarcode && cleanBarcode !== existing.barcode) {
      const barcodeConflict = await db.product.findUnique({
        where: { barcode: cleanBarcode },
      });
      if (barcodeConflict && barcodeConflict.id !== id) {
        return NextResponse.json(
          { success: false, message: `Barcode "${cleanBarcode}" sudah digunakan produk lain.` },
          { status: 400 }
        );
      }
    }

    const updated = await db.$transaction(async (tx) => {
      // If stock changed manually, record StockMovement
      if (stock !== existing.stock) {
        const diff = stock - existing.stock;
        await tx.stockMovement.create({
          data: {
            productId: id,
            type: "ADJUSTMENT",
            quantity: diff,
            stockBefore: existing.stock,
            stockAfter: stock,
            note: "Penyesuaian stok manual oleh admin",
          },
        });
      }

      return await tx.product.update({
        where: { id },
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
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: unknown) {
    console.error("PUT /api/products/[id] error:", error);
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan internal.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Akses ditolak." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const isActive = Boolean(body.isActive);

    const updated = await db.product.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/products/[id] error:", error);
    const msg = error instanceof Error ? error.message : "Gagal mengubah status produk.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
