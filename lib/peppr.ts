import { Peppol } from "@getpeppr/sdk";

// Module-level singleton — safe in Node.js runtime (default).
// Do not use with Edge Runtime (export const runtime = "edge") — instantiate per-request instead.
let _peppol: Peppol | null = null;

export function getPeppol() {
  if (!_peppol) {
    const apiKey = process.env.GETPEPPR_API_KEY;
    if (!apiKey) {
      throw new Error("GETPEPPR_API_KEY is not set — add it to .env.local");
    }
    _peppol = new Peppol({ apiKey });
  }
  return _peppol;
}
