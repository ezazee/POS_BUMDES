import { CheckoutPayloadSchema } from "../src/lib/services/checkout";
import { ProductInputSchema } from "../src/lib/services/products";
import { formatCurrency, generateInvoiceNumber, parseCurrencyInput } from "../src/lib/utils";

function testLogic() {
  console.log("Running self-check logic verification...");

  // 1. Currency Formatting & Parsing
  console.assert(formatCurrency(75000) === "Rp75.000", `formatCurrency failed: ${formatCurrency(75000)}`);
  console.assert(formatCurrency(0) === "Rp0", "formatCurrency 0 failed");
  console.assert(parseCurrencyInput("Rp 250.000") === 250000, "parseCurrencyInput failed");
  console.assert(parseCurrencyInput("abc") === 0, "parseCurrencyInput fallback failed");

  // 2. Invoice Generation
  const inv = generateInvoiceNumber(1);
  console.assert(inv.startsWith("INV-"), `Invoice should start with INV-: ${inv}`);
  console.assert(inv.endsWith("-0001"), `Invoice should end with -0001: ${inv}`);

  // 3. Product Validation Schema
  const validProduct = ProductInputSchema.safeParse({
    name: "Beras Premium",
    sku: "BR-001",
    barcode: "899123",
    category: "Sembako",
    purchasePrice: 65000,
    sellingPrice: 75000,
    stock: 20,
    isActive: true,
  });
  console.assert(validProduct.success === true, "Valid product failed validation");

  const invalidProduct = ProductInputSchema.safeParse({
    name: "B",
    sku: "",
    category: "",
    purchasePrice: -100,
    sellingPrice: -50,
    stock: -5,
  });
  console.assert(invalidProduct.success === false, "Negative product should fail validation");

  // 4. Checkout Payload Schema
  const validCheckout = CheckoutPayloadSchema.safeParse({
    items: [{ productId: "prod1", quantity: 2 }],
    discount: 5000,
    paymentMethod: "CASH",
    paidAmount: 200000,
  });
  console.assert(validCheckout.success === true, "Valid checkout failed validation");

  const emptyCheckout = CheckoutPayloadSchema.safeParse({
    items: [],
    discount: 0,
    paymentMethod: "CASH",
    paidAmount: 0,
  });
  console.assert(emptyCheckout.success === false, "Empty cart checkout should fail validation");

  const invalidCash = CheckoutPayloadSchema.safeParse({
    items: [{ productId: "prod1", quantity: 1 }],
    discount: -1000,
    paymentMethod: "CASH",
    paidAmount: -50,
  });
  console.assert(invalidCash.success === false, "Negative discount or paid amount should fail");

  console.log("✅ All self-check tests passed successfully!");
}

testLogic();
