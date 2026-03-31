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

The demo `/api/send-invoice` route has **no authentication**. Anyone who discovers the URL can trigger invoice sends against your API key.

Before going live:
- Add your own auth (session, API key, etc.) to the route
- Or remove it entirely and call the SDK from your authenticated backend logic

## 4. Secure your webhook endpoint

If you set up webhooks, consider adding rate limiting in production to prevent abuse:
- [Vercel WAF](https://vercel.com/docs/security) for infrastructure-level protection
- [Upstash Rate Limiting](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview) for application-level control

## 5. Monitor errors

We recommend [Sentry](https://sentry.io) for error tracking. Add the Next.js SDK:

```bash
npx @sentry/wizard@latest -i nextjs
```

## Need help?

- [Documentation](https://docs.getpeppr.dev)
- [SDK Reference](https://www.npmjs.com/package/@getpeppr/sdk)
- [Support](https://getpeppr.dev)
