import { db } from "../src/lib/db";
import { auth } from "../src/lib/auth";

async function main() {
  console.log("🌱 Starting BUMDes POS database seed...");

  // 1. Create or ensure Admin & Cashier users
  const adminEmail = "admin@bumdes.desa.id";
  const cashierEmail = "kasir@bumdes.desa.id";

  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    console.log("Creating Admin user...");
    const res = await auth.api.signUpEmail({
      body: {
        name: "Pengelola Admin BUMDes",
        email: adminEmail,
        password: "admin123",
      },
    });
    if (res?.user?.id) {
      await db.user.update({
        where: { id: res.user.id },
        data: { role: "ADMIN", isActive: true },
      });
    }
  } else {
    await db.user.update({
      where: { email: adminEmail },
      data: { role: "ADMIN", isActive: true },
    });
  }

  const existingCashier = await db.user.findUnique({ where: { email: cashierEmail } });
  if (!existingCashier) {
    console.log("Creating Cashier user...");
    const res = await auth.api.signUpEmail({
      body: {
        name: "Kasir Shift 1 (Adi Pratama)",
        email: cashierEmail,
        password: "kasir123",
      },
    });
    if (res?.user?.id) {
      await db.user.update({
        where: { id: res.user.id },
        data: { role: "CASHIER", isActive: true },
      });
    }
  } else {
    await db.user.update({
      where: { email: cashierEmail },
      data: { role: "CASHIER", isActive: true },
    });
  }

  // 2. Seed Default Settings
  console.log("Seeding settings...");
  await db.setting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      bumdesName: "BUMDes Mandiri Sejahtera",
      address: "Jl. Raya Desa Karangsari No. 12, Jawa Tengah",
      phone: "0812-3456-7890",
      receiptFooter: "Terima kasih atas kunjungan Anda. Belanja di BUMDes membangun kemandirian desa.",
    },
  });

  // 3. Seed Products
  console.log("Seeding products...");
  const sampleProducts = [
    {
      name: "Beras Premium Rojolele 5kg",
      sku: "BR-001",
      barcode: "899100100101",
      category: "Sembako",
      purchasePrice: 65000,
      sellingPrice: 75000,
      stock: 25,
      isActive: true,
    },
    {
      name: "Beras Medium C4 5kg",
      sku: "BR-002",
      barcode: "899100100102",
      category: "Sembako",
      purchasePrice: 52000,
      sellingPrice: 60000,
      stock: 20,
      isActive: true,
    },
    {
      name: "Minyak Goreng Bimoli 1L",
      sku: "MN-001",
      barcode: "899100100201",
      category: "Sembako",
      purchasePrice: 15500,
      sellingPrice: 18000,
      stock: 35,
      isActive: true,
    },
    {
      name: "Minyak Goreng Bimoli 2L",
      sku: "MN-002",
      barcode: "899100100202",
      category: "Sembako",
      purchasePrice: 31000,
      sellingPrice: 36000,
      stock: 15,
      isActive: true,
    },
    {
      name: "Gula Pasir Gulaku 1kg",
      sku: "GL-001",
      barcode: "899100100301",
      category: "Sembako",
      purchasePrice: 15000,
      sellingPrice: 17500,
      stock: 40,
      isActive: true,
    },
    {
      name: "Telur Ayam Negeri 1kg",
      sku: "TL-001",
      barcode: "899100100401",
      category: "Sembako",
      purchasePrice: 26000,
      sellingPrice: 30000,
      stock: 50,
      isActive: true,
    },
    {
      name: "Tepung Terigu Segitiga Biru 1kg",
      sku: "TP-001",
      barcode: "899100100501",
      category: "Sembako",
      purchasePrice: 10000,
      sellingPrice: 12500,
      stock: 30,
      isActive: true,
    },
    {
      name: "Mi Instan Goreng Dus (40 pcs)",
      sku: "MI-001",
      barcode: "899100100601",
      category: "Makanan Ringan",
      purchasePrice: 102000,
      sellingPrice: 115000,
      stock: 6,
      isActive: true,
    },
    {
      name: "Mi Instan Soto Dus (40 pcs)",
      sku: "MI-002",
      barcode: "899100100602",
      category: "Makanan Ringan",
      purchasePrice: 98000,
      sellingPrice: 110000,
      stock: 8,
      isActive: true,
    },
    {
      name: "Kopi Bubuk Robusta Lokal 250g",
      sku: "KP-001",
      barcode: "899100100701",
      category: "Minuman",
      purchasePrice: 20000,
      sellingPrice: 25000,
      stock: 12,
      isActive: true,
    },
    {
      name: "Teh Celup Melati Kotak",
      sku: "TH-001",
      barcode: "899100100702",
      category: "Minuman",
      purchasePrice: 5500,
      sellingPrice: 7000,
      stock: 3,
      isActive: true,
    },
    {
      name: "Susu Kental Manis Frisian Flag 370g",
      sku: "SS-001",
      barcode: "899100100703",
      category: "Minuman",
      purchasePrice: 10500,
      sellingPrice: 12500,
      stock: 24,
      isActive: true,
    },
    {
      name: "Air Mineral Galon Aqua 19L",
      sku: "AM-001",
      barcode: "899100100704",
      category: "Minuman",
      purchasePrice: 16000,
      sellingPrice: 20000,
      stock: 18,
      isActive: true,
    },
    {
      name: "Sabun Mandi Lifebuoy Batang",
      sku: "SB-001",
      barcode: "899100100801",
      category: "Kebersihan",
      purchasePrice: 3500,
      sellingPrice: 5000,
      stock: 45,
      isActive: true,
    },
    {
      name: "Detergen Daia Bubuk 800g",
      sku: "DT-001",
      barcode: "899100100802",
      category: "Kebersihan",
      purchasePrice: 16500,
      sellingPrice: 19500,
      stock: 22,
      isActive: true,
    },
    {
      name: "Gas LPG 3kg Melon",
      sku: "GS-001",
      barcode: "899100100901",
      category: "Energi",
      purchasePrice: 18000,
      sellingPrice: 22000,
      stock: 14,
      isActive: true,
    },
    {
      name: "Pupuk NPK Desa 5kg",
      sku: "PK-001",
      barcode: "899100101001",
      category: "Pertanian",
      purchasePrice: 38000,
      sellingPrice: 45000,
      stock: 8,
      isActive: true,
    },
    {
      name: "Pupuk Urea Desa 5kg",
      sku: "PK-002",
      barcode: "899100101002",
      category: "Pertanian",
      purchasePrice: 32000,
      sellingPrice: 38000,
      stock: 10,
      isActive: true,
    },
  ];

  for (const product of sampleProducts) {
    await db.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product,
    });
  }

  console.log(`✅ Database seed completed with ${sampleProducts.length} products.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
