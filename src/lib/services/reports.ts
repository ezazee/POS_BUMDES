import { db } from "@/lib/db";

export interface ReportMetrics {
  totalRevenue: number;
  grossProfit: number;
  transactionsCount: number;
  productsSoldCount: number;
}

export interface DailyReportRow {
  dateKey: string;
  formattedDate: string;
  transactionsCount: number;
  revenue: number;
  grossProfit: number;
  averageTransaction: number;
}

export interface ReportData {
  metrics: ReportMetrics;
  dailyBreakdown: DailyReportRow[];
}

export async function getReportData(dateFilter = "month", customStart?: string, customEnd?: string): Promise<ReportData> {
  try {
    let startDate: Date;
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    if (dateFilter === "today") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (dateFilter === "7days") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else if (dateFilter === "custom" && customStart && customEnd) {
      startDate = new Date(customStart);
      startDate.setHours(0, 0, 0, 0);
      endDate.setTime(new Date(customEnd).getTime());
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Current month default
      startDate = new Date();
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }

    const txs = await db.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    let totalRevenue = 0;
    let grossProfit = 0;
    let productsSoldCount = 0;

    // Grouping by date (YYYY-MM-DD)
    const grouped = new Map<string, { count: number; revenue: number; profit: number }>();

    for (const tx of txs) {
      totalRevenue += tx.total;

      let txGrossProfit = 0;
      for (const item of tx.items) {
        productsSoldCount += item.quantity;
        const itemProfit = (item.sellingPrice - item.purchasePrice) * item.quantity;
        txGrossProfit += itemProfit;
      }
      // Discount reduces gross profit
      txGrossProfit = Math.max(0, txGrossProfit - tx.discount);
      grossProfit += txGrossProfit;

      const d = tx.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      const existing = grouped.get(key) || { count: 0, revenue: 0, profit: 0 };
      grouped.set(key, {
        count: existing.count + 1,
        revenue: existing.revenue + tx.total,
        profit: existing.profit + txGrossProfit,
      });
    }

    const dailyBreakdown: DailyReportRow[] = Array.from(grouped.entries()).map(([key, val]) => {
      const parts = key.split("-").map(Number);
      const rowDate = new Date(parts[0], parts[1] - 1, parts[2]);
      const formattedDate = new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(rowDate);

      return {
        dateKey: key,
        formattedDate,
        transactionsCount: val.count,
        revenue: val.revenue,
        grossProfit: val.profit,
        averageTransaction: val.count > 0 ? Math.round(val.revenue / val.count) : 0,
      };
    });

    return {
      metrics: {
        totalRevenue,
        grossProfit,
        transactionsCount: txs.length,
        productsSoldCount,
      },
      dailyBreakdown,
    };
  } catch (error) {
    console.error("Report data calculation error:", error);
    return {
      metrics: {
        totalRevenue: 0,
        grossProfit: 0,
        transactionsCount: 0,
        productsSoldCount: 0,
      },
      dailyBreakdown: [],
    };
  }
}
