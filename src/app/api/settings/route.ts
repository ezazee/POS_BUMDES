import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { db } from "@/lib/db";
import { z } from "zod";

const SettingsSchema = z.object({
  bumdesName: z.string().min(2, "Nama BUMDes minimal 2 karakter"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  phone: z.string().min(6, "Nomor telepon minimal 6 karakter"),
  receiptFooter: z.string().min(3, "Catatan kaki struk minimal 3 karakter"),
});

export async function GET() {
  try {
    const setting = await db.setting.findUnique({
      where: { id: "default" },
    });

    if (!setting) {
      return NextResponse.json({
        success: true,
        setting: {
          bumdesName: "BUMDes Mandiri Sejahtera",
          address: "Jl. Raya Desa Karangsari No. 12, Jawa Tengah",
          phone: "0812-3456-7890",
          receiptFooter: "Terima kasih atas kunjungan Anda. Belanja di BUMDes membangun kemandirian desa.",
        },
      });
    }

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({
      success: true,
      setting: {
        bumdesName: "BUMDes Mandiri Sejahtera",
        address: "Jl. Raya Desa Karangsari No. 12, Jawa Tengah",
        phone: "0812-3456-7890",
        receiptFooter: "Terima kasih atas kunjungan Anda. Belanja di BUMDes membangun kemandirian desa.",
      },
    });
  }
}

export async function PUT(req: Request) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Hanya Admin yang dapat mengubah pengaturan." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = SettingsSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const updated = await db.setting.upsert({
      where: { id: "default" },
      update: parsed.data,
      create: {
        id: "default",
        ...parsed.data,
      },
    });

    return NextResponse.json({ success: true, setting: updated });
  } catch (error: unknown) {
    console.error("PUT /api/settings error:", error);
    const msg = error instanceof Error ? error.message : "Gagal menyimpan pengaturan.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
