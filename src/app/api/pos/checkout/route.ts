import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { processCheckout, CheckoutPayloadSchema } from "@/lib/services/checkout";

export async function POST(req: Request) {
  try {
    const { user } = await getCurrentSession();
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid atau telah berakhir." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = CheckoutPayloadSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const result = await processCheckout(parsed.data, user.id);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("API pos/checkout error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal server.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
