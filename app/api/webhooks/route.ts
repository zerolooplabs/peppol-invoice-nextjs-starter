import { NextRequest, NextResponse } from "next/server";
import { Peppol } from "@getpeppr/sdk";

/**
 * Webhook handler for getpeppr invoice events.
 *
 * Configure this endpoint in the getpeppr Console under Webhooks:
 *   URL: https://your-app.com/api/webhooks
 *
 * Events you'll receive:
 *   - invoice.sent      — Invoice accepted for Peppol delivery
 *   - invoice.accepted  — Recipient acknowledged receipt
 *   - invoice.refused   — Recipient refused the invoice
 *   - invoice.error     — Delivery error
 *   - invoice.registered — Registered with tax authority
 *   - test.ping         — Manual test from the dashboard
 */
export async function POST(request: NextRequest) {
  const secret = process.env.GETPEPPR_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] GETPEPPR_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // 1. Read the raw body (must be string, not parsed JSON)
  const rawBody = await request.text();
  const signature = request.headers.get("getpeppr-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // 2. Verify signature using the SDK
  let event;
  try {
    event = await Peppol.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed";
    console.error("[webhook] Signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 401 });
  }

  // 3. Handle the event
  console.log(`[webhook] Received ${event.type}`, event.data);

  switch (event.type) {
    case "invoice.sent":
      // Invoice has been accepted by the Peppol network for delivery
      // TODO: Update your database, notify the user, etc.
      break;

    case "invoice.accepted":
      // Recipient confirmed receipt
      // TODO: Mark invoice as confirmed in your system
      break;

    case "invoice.refused":
      // Recipient refused the invoice — check event.data for details
      // TODO: Alert the user, flag the invoice
      break;

    case "invoice.error":
      // Delivery failed — check event.data for error details
      // TODO: Retry or alert the user
      break;

    case "test.ping":
      // Test event from the getpeppr dashboard — no action needed
      break;

    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
