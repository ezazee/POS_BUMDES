import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireRole(["ADMIN"]);

  let setting = await db.setting.findUnique({
    where: { id: "default" },
  });

  if (!setting) {
    setting = {
      id: "default",
      bumdesName: "BUMDes Mandiri Sejahtera",
      address: "Jl. Raya Desa Karangsari No. 12, Jawa Tengah",
      phone: "0812-3456-7890",
      receiptFooter: "Terima kasih atas kunjungan Anda. Belanja di BUMDes membangun kemandirian desa.",
      updatedAt: new Date(),
    };
  }

  return (
    <AppShell userRole={user.role} userName={user.name}>
      <SettingsClient
        initialSettings={{
          bumdesName: setting.bumdesName,
          address: setting.address,
          phone: setting.phone,
          receiptFooter: setting.receiptFooter,
        }}
      />
    </AppShell>
  );
}
