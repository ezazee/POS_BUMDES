import { db } from "@/lib/db";

export interface DashboardData {
  todayRevenue: number;
  todayTransactionsCount: number;
  totalProductsCount: number;
  lowStockProductsCount: number;
  recentTransactions: Array<{
    id: string;
    invoiceNumber: string;
    createdAt: Date;
    total: number;
    paymentMethod: string;
    cashierName: string;
    itemsCount: number;
  }>;
  lowStockItems: Array<{
    id: string;
    name: string;
    sku: string;
    category: string;
    stock: number;
    sellingPrice: number;
  }>;
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      todayRevenueAggr,
      todayTxCount,
      totalProducts,
      lowStockProducts,
      recentTxList,
      lowStockList,
    ] = await Promise.all([
      db.transaction.aggregate({
        _sum: { total: true },
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      db.transaction.count({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      db.product.count({
        where: { isActive: true },
      }),
      db.product.count({
        where: {
          isActive: true,
          stock: { lte: 5 },
        },
      }),
      db.transaction.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          cashier: { select: { name: true } },
          items: { select: { quantity: true } },
        },
      }),
      db.product.findMany({
        where: {
          isActive: true,
          stock: { lte: 5 },
        },
        take: 5,
        orderBy: { stock: "asc" },
      }),
    ]);

    return {
      todayRevenue: todayRevenueAggr._sum.total ?? 0,
      todayTransactionsCount: todayTxCount,
      totalProductsCount: totalProducts,
      lowStockProductsCount: lowStockProducts,
      recentTransactions: recentTxList.map((tx) => ({
        id: tx.id,
        invoiceNumber: tx.invoiceNumber,
        createdAt: tx.createdAt,
        total: tx.total,
        paymentMethod: tx.paymentMethod,
        cashierName: tx.cashier.name,
        itemsCount: tx.items.reduce((acc, item) => acc + item.quantity, 0),
      })),
      lowStockItems: lowStockList.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        stock: p.stock,
        sellingPrice: p.sellingPrice,
      })),
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    // ponytail: fallback to safe defaults if DB connection is pending; upgrade path: propagate error boundary
    return {
      todayRevenue: 0,
      todayTransactionsCount: 0,
      totalProductsCount: 0,
      lowStockProductsCount: 0,
      recentTransactions: [],
      lowStockItems: [],
    };
  }
}
