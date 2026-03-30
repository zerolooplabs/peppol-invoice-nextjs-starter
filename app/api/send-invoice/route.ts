import { NextResponse } from "next/server";
import { getPeppol } from "@/lib/peppr";

export async function POST() {
  try {
    const peppol = getPeppol();
    const result = await peppol.invoices.send({
      number: `DEMO-${Date.now()}`,
      dueDate: new Date(Date.now() + 30 * 86400000)
        .toISOString()
        .split("T")[0],
      to: {
        name: "Acme Corp",
        peppolId: "0208:BE0123456789",
        street: "Avenue Louise 54",
        city: "Brussels",
        postalCode: "1050",
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
      consoleUrl: `https://console.getpeppr.dev/invoices/${result.id}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
