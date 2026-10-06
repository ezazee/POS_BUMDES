import { db } from "@/lib/db";
import { generateInvoiceNumber } from "@/lib/utils";
import { z } from "zod";

export const CheckoutItemSchema = z.object({
  productId: z.string().min(1, "Product ID wajib diisi"),
  quantity: z.number().int().min(1, "Jumlah minimal 1"),
});

export const CheckoutPayloadSchema = z.object({
  items: z.array(CheckoutItemSchema).min(1, "Keranjang belanja tidak boleh kosong"),
  discount: z.number().int().min(0, "Diskon tidak boleh negatif").default(0),
  paymentMethod: z.enum(["CASH", "TRANSFER", "QRIS"]),
  paidAmount: z.number().int().min(0, "Jumlah bayar tidak boleh negatif").default(0),
});

export type CheckoutPayload = z.infer<typeof CheckoutPayloadSchema>;

export interface CheckoutResult {
  success: boolean;
  message?: string;
  transaction?: {
    id: string;
    invoiceNumber: string;
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paidAmount: number;
    changeAmount: number;
    cashierName: string;
    createdAt: Date;
    items: Array<{
      id: string;
      productName: string;
      quantity: number;
      sellingPrice: number;
      subtotal: number;
    }>;
  };
}

export async function processCheckout(
  payload: CheckoutPayload,
  cashierId: string
): Promise<CheckoutResult> {
  const validated = CheckoutPayloadSchema.safeParse(payload);
  if (!validated.success) {
    const errorMsg = validated.error.errors.map((e) => e.message).join(", ");
    return { success: false, message: errorMsg };
  }

  const { items: requestedItems, discount, paymentMethod, paidAmount } = validated.data;

  try {
    return await db.$transaction(async (tx) => {
      // 1. Fetch latest product info and lock/validate
      const productIds = requestedItems.map((item) => item.productId);
      const dbProducts = await tx.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
      });

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));

      // 2. Validate all products exist and have sufficient stock
      for (const item of requestedItems) {
        const prod = productMap.get(item.productId);
        if (!prod) {
          throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan atau nonaktif.`);
        }
        if (prod.stock < item.quantity) {
          throw new Error(
            `Stok untuk "${prod.name}" tidak mencukupi (Tersedia: ${prod.stock}, Diminta: ${item.quantity}).`
          );
        }
      }

      // 3. Calculate subtotal server-side using current db prices
      let calculatedSubtotal = 0;
      const preparedItems = requestedItems.map((item) => {
        const prod = productMap.get(item.productId)!;
        const itemSubtotal = prod.sellingPrice * item.quantity;
        calculatedSubtotal += itemSubtotal;

        return {
          productId: prod.id,
          productName: prod.name,
          quantity: item.quantity,
          purchasePrice: prod.purchasePrice,
          sellingPrice: prod.sellingPrice,
          subtotal: itemSubtotal,
          currentStock: prod.stock,
        };
      });

      // 4. Calculate discount & total server-side
      const safeDiscount = Math.min(discount, calculatedSubtotal);
      const calculatedTotal = Math.max(0, calculatedSubtotal - safeDiscount);

      // 5. Payment validation
      let finalPaidAmount = paidAmount;
      let finalChangeAmount = 0;

      if (paymentMethod === "CASH") {
        if (paidAmount < calculatedTotal) {
          throw new Error(
            `Nominal uang tunai diterima (Rp${paidAmount.toLocaleString("id-ID")}) kurang dari total tagihan (Rp${calculatedTotal.toLocaleString("id-ID")}).`
          );
        }
        finalChangeAmount = paidAmount - calculatedTotal;
      } else {
        // Non-cash (QRIS / Transfer) is exact
        finalPaidAmount = calculatedTotal;
        finalChangeAmount = 0;
      }

      // 6. Generate unique invoice number
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const txCountToday = await tx.transaction.count({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

      const invoiceNumber = generateInvoiceNumber(txCountToday + 1);

      // 7. Create Transaction record
      const createdTx = await tx.transaction.create({
        data: {
          invoiceNumber,
          subtotal: calculatedSubtotal,
          discount: safeDiscount,
          total: calculatedTotal,
          paymentMethod,
          paidAmount: finalPaidAmount,
          changeAmount: finalChangeAmount,
          cashierId,
        },
        include: {
          cashier: { select: { name: true } },
        },
      });

      // 8. Create TransactionItems, decrement stock & create StockMovement records
      for (const item of preparedItems) {
        // Create TransactionItem
        await tx.transactionItem.create({
          data: {
            transactionId: createdTx.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
            sellingPrice: item.sellingPrice,
            subtotal: item.subtotal,
          },
        });

        // Decrement Product stock atomically
        const newStock = item.currentStock - item.quantity;
        if (newStock < 0) {
          throw new Error(`Stok produk "${item.productName}" tidak boleh negatif.`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        });

        // Create StockMovement record
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: "SALE",
            quantity: -item.quantity,
            stockBefore: item.currentStock,
            stockAfter: newStock,
            referenceId: createdTx.id,
            note: `Penjualan POS #${invoiceNumber}`,
          },
        });
      }

      return {
        success: true,
        transaction: {
          id: createdTx.id,
          invoiceNumber: createdTx.invoiceNumber,
          subtotal: createdTx.subtotal,
          discount: createdTx.discount,
          total: createdTx.total,
          paymentMethod: createdTx.paymentMethod,
          paidAmount: createdTx.paidAmount,
          changeAmount: createdTx.changeAmount,
          cashierName: createdTx.cashier.name,
          createdAt: createdTx.createdAt,
          items: preparedItems.map((pi, idx) => ({
            id: `${createdTx.id}-${idx}`,
            productName: pi.productName,
            quantity: pi.quantity,
            sellingPrice: pi.sellingPrice,
            subtotal: pi.subtotal,
          })),
        },
      };
    });
  } catch (error: unknown) {
    console.error("Checkout transaction error:", error);
    const message = error instanceof Error ? error.message : "Gagal memproses checkout transaksi.";
    return { success: false, message };
  }
}
