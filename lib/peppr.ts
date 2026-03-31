import { Peppol } from "@getpeppr/sdk";

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
