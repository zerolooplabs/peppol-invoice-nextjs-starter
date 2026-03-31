# Peppol Invoice Starter (Next.js)

Send your first Peppol e-invoice in under 2 minutes.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzerolooplabs%2Fpeppol-invoice-nextjs-starter&env=GETPEPPR_API_KEY,GETPEPPR_WEBHOOK_SECRET&envDescription=Get%20your%20sandbox%20API%20key%20and%20webhook%20secret%20at%20console.getpeppr.dev&project-name=peppol-invoice-starter)

## Prerequisites

You need a getpeppr account with a sandbox API key:

1. Sign up at [console.getpeppr.dev](https://console.getpeppr.dev)
2. Create an organization
3. Go to **API Keys** and create a sandbox key (`sk_sandbox_...`)

## Quick Start

```bash
git clone https://github.com/zerolooplabs/peppol-invoice-nextjs-starter.git
cd peppol-invoice-nextjs-starter
cp .env.example .env.local   # Paste your API key
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Send Demo Invoice**.

## What Happens

1. Click the button — a real Peppol invoice is sent to the sandbox network
2. You get back an invoice ID and status
3. Click the console link to see your invoice arrive in the getpeppr dashboard

This is not a mock. The invoice goes through the actual Peppol infrastructure.

## Webhooks (Optional)

Get notified when your invoice status changes (sent, accepted, refused, error):

1. Go to **Webhooks** in the [getpeppr Console](https://console.getpeppr.dev/webhooks)
2. Add your endpoint URL: `https://your-app.com/api/webhooks`
3. Copy the signing secret (`whsec_...`)
4. Add to `.env.local`:
   ```
   GETPEPPR_WEBHOOK_SECRET=whsec_your_secret_here
   ```

The webhook handler at `app/api/webhooks/route.ts` verifies signatures using the SDK and logs events. Customize the `switch` statement to handle events in your app.

For local development, use a tunnel like [ngrok](https://ngrok.com) to expose your localhost.

## Project Structure

```
lib/peppr.ts                       — SDK client
app/api/send-invoice/route.ts      — Send endpoint
app/api/webhooks/route.ts          — Webhook handler
app/page.tsx                       — UI
```

## Going to Production

See [docs/production.md](./docs/production.md) for the sandbox-to-production guide.

## Links

- [getpeppr Documentation](https://docs.getpeppr.dev)
- [SDK on npm](https://www.npmjs.com/package/@getpeppr/sdk)
- [Console](https://console.getpeppr.dev)

## License

MIT
