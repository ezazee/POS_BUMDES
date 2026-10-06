import { db } from "@/lib/db";

export interface TransactionSummaryItem {
  id: string;
  invoiceNumber: string;
  createdAt: Date;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paidAmount: number;
  changeAmount: number;
  cashierName: string;
  itemsCount: number;
  itemsSummary: string;
}

export interface TransactionDetail {
  id: string;
  invoiceNumber: string;
  createdAt: Date;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paidAmount: number;
  changeAmount: number;
  cashierName: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    subtotal: number;
  }>;
}

export async function getTransactionsList(query?: {
  search?: string;
  paymentMethod?: string;
  dateFilter?: string;
}) {
  try {
    const whereClause: Record<string, unknown> = {};

    if (query?.paymentMethod && query.paymentMethod !== "all") {
      whereClause.paymentMethod = query.paymentMethod;
    }

    if (query?.search && query.search.trim()) {
      whereClause.invoiceNumber = {
        contains: query.search.trim(),
        mode: "insensitive",
      };
    }

    if (query?.dateFilter === "today") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      whereClause.createdAt = { gte: todayStart };
    } else if (query?.dateFilter === "7days") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      d.setHours(0, 0, 0, 0);
      whereClause.createdAt = { gte: d };
    }

    const txs = await db.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        cashier: { select: { name: true } },
        items: true,
      },
    });

    return txs.map((t) => ({
      id: t.id,
      invoiceNumber: t.invoiceNumber,
      createdAt: t.createdAt,
      subtotal: t.subtotal,
      discount: t.discount,
      total: t.total,
      paymentMethod: t.paymentMethod,
      paidAmount: t.paidAmount,
      changeAmount: t.changeAmount,
      cashierName: t.cashier.name,
      itemsCount: t.items.reduce((acc, item) => acc + item.quantity, 0),
      itemsSummary: t.items
        .map((i) => `${i.productName} (x${i.quantity})`)
        .slice(0, 2)
        .join(", ") + (t.items.length > 2 ? ` +${t.items.length - 2} lainnya` : ""),
    }));
  } catch (error) {
    console.error("Error fetching transactions list:", error);
    return [];
  }
}

export async function getTransactionById(id: string): Promise<TransactionDetail | null> {
  try {
    const tx = await db.transaction.findUnique({
      where: { id },
      include: {
        cashier: { select: { name: true } },
        items: true,
      },
    });

    if (!tx) return null;

    return {
      id: tx.id,
      invoiceNumber: tx.invoiceNumber,
      createdAt: tx.createdAt,
      subtotal: tx.subtotal,
      discount: tx.discount,
      total: tx.total,
      paymentMethod: tx.paymentMethod,
      paidAmount: tx.paidAmount,
      changeAmount: tx.changeAmount,
      cashierName: tx.cashier.name,
      items: tx.items.map((i) => ({
        id: i.id,
        productName: i.productName,
        quantity: i.quantity,
        purchasePrice: i.purchasePrice,
        sellingPrice: i.sellingPrice,
        subtotal: i.subtotal,
      })),
    };
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    return null;
  }
}
