# Going to Production

This starter uses a **sandbox** API key. Here's how to go live.

## 1. Switch your API key

Replace your sandbox key with a production key in `.env.local`:

```
GETPEPPR_API_KEY=sk_live_your_production_key
```

Production keys are available once your account is upgraded from sandbox. See [getpeppr pricing](https://getpeppr.dev/#pricing).

## 2. Replace demo invoice data

The starter sends a hardcoded demo invoice. Replace the invoice payload in `app/api/send-invoice/route.ts` with real customer data:

- `to` — your customer's Peppol ID and address
- `lines` — your actual line items
- `number` — your invoice numbering scheme
- `dueDate` — your payment terms

## 3. Protect the send endpoint

The demo `/api/send-invoice` route has **no authentication**. Anyone who discovers the URL can trigger invoice sends against your API key — this means real Peppol network traffic billed to your account.

Before going live, add authentication:

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Verify the user is authenticated (adapt to your auth provider)
  // Examples: NextAuth getServerSession(authOptions), Clerk auth(),
  //           Supabase createClient().auth.getUser(), or a custom JWT check
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ... rest of your invoice logic
}
```

Alternatively, remove the route entirely and call the SDK directly from your authenticated backend logic.

## 4. Validate input

When you modify the send route to accept dynamic invoice data from the request body, always validate input before passing it to the SDK:

```ts
import { z } from "zod";

// Add number, dueDate, currency, and any other fields your app needs
const InvoiceSchema = z.object({
  number: z.string().min(1),
  dueDate: z.string().date(),
  to: z.object({
    name: z.string().min(1),
    peppolId: z.string().regex(/^\d{4}:.+$/),
    street: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().length(2),
  }),
  lines: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    vatRate: z.number().min(0).max(100),
  })).min(1),
  buyerReference: z.string().optional(),
});

// safeParse returns { success, data, error } instead of throwing
const parsed = InvoiceSchema.safeParse(await request.json());
if (!parsed.success) {
  return NextResponse.json(
    { error: "Invalid input", details: parsed.error.flatten() },
    { status: 400 },
  );
}
const result = await peppol.invoices.send(parsed.data);
```

Never pass raw `request.json()` directly to the SDK without validation.

## 5. Secure your webhook endpoint

If you set up webhooks, consider adding rate limiting in production to prevent abuse:
- [Vercel WAF](https://vercel.com/docs/security) for infrastructure-level protection
- [Upstash Rate Limiting](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview) for application-level control

## 6. Restrict CORS

Next.js API routes respond to requests from any origin by default. If your API routes accept dynamic data, restrict cross-origin access to your own domain using middleware or a CORS library.

## 7. Monitor errors

We recommend [Sentry](https://sentry.io) for error tracking. Add the Next.js SDK:

```bash
npx @sentry/wizard@latest -i nextjs
```

## Need help?

- [Documentation](https://docs.getpeppr.dev)
- [SDK Reference](https://www.npmjs.com/package/@getpeppr/sdk)
- [Support](https://getpeppr.dev)
