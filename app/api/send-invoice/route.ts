import { NextResponse } from "next/server";
import { PeppolValidationError, PeppolApiError } from "@getpeppr/sdk";
import { getPeppol } from "@/lib/peppr";

export async function POST() {
  // ── Auth guard ─────────────────────────────────────────────────
  // This demo route has NO authentication. Before going to production,
  // add your own auth here (session, API key, JWT, etc.):
  //
  //   const session = await getServerSession();
  //   if (!session) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  //
  // See docs/production.md for details.
  // ───────────────────────────────────────────────────────────────

  try {
    const peppol = getPeppol();
    const result = await peppol.invoices.send({
      // In production: use a sequential invoice number from your database
      number: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      dueDate: new Date(Date.now() + 30 * 86400000)
        .toISOString()
        .split("T")[0],
      to: {
        name: "Acme Corp",
        peppolId: "9925:BE0314595348",
        street: "Bd du Roi Albert II 16",
        city: "Brussels",
        postalCode: "1000",
        country: "BE",
      },
      lines: [
        {
          description: "Platform subscription — Monthly",
          quantity: 1,
          unitPrice: 99.0,
          vatRate: 21,
        },
      ],
      buyerReference: "DEMO",
    });

    return NextResponse.json({
      id: result.id,
      status: result.status,
      createdAt: result.createdAt,
      // Console URL — update if the dashboard route structure changes
      consoleUrl: `https://console.getpeppr.dev/invoices/${result.id}`,
    });
  } catch (error) {
    console.error("[send-invoice]", error);

    if (error instanceof PeppolValidationError) {
      return NextResponse.json(
        { error: "Invalid invoice data", details: error.validation.errors },
        { status: 422 },
      );
    }
    if (error instanceof PeppolApiError) {
      return NextResponse.json(
        { error: "Invoice delivery failed" },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { error: "Unexpected error — check server logs" },
      { status: 500 },
    );
  }
}
