import { Peppol } from "@getpeppr/sdk";

let _peppol: Peppol | null = null;

export function getPeppol() {
  if (!_peppol) {
    _peppol = new Peppol({
      apiKey: process.env.GETPEPPR_API_KEY!,
    });
  }
  return _peppol;
}
