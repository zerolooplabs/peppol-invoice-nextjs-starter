import { NextResponse } from "next/server";
import { webhooks } from "@getpeppr/sdk";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-b2brouter-signature") ?? "";

  try {
    const event = await webhooks.constructEvent(
      rawBody,
      signature,
      process.env.GETPEPPR_WEBHOOK_SECRET!,
    );

    switch (event.type) {
      case "invoice.sent":
        console.log(`Invoice ${event.id} was sent via Peppol`);
        break;
      case "invoice.accepted":
        console.log(`Invoice ${event.id} was accepted by recipient`);
        break;
      case "invoice.refused":
        console.log(`Invoice ${event.id} was refused`);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
