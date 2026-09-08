/**
 * Build-time public config. All values are optional; features degrade gracefully
 * when unset so the static export works with zero configuration.
 *
 * Set in `.env.local` (dev) or as GitHub Actions variables (deploy):
 *   NEXT_PUBLIC_FORM_ENDPOINT   e.g. https://api.web3forms.com/submit or https://formspree.io/f/xxxx
 *   NEXT_PUBLIC_FORM_ACCESS_KEY Web3Forms access key (omit for Formspree)
 *   NEXT_PUBLIC_GOATCOUNTER     e.g. amisha  (→ https://amisha.goatcounter.com/count)
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
export const FORM_ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY ?? "";
export const GOATCOUNTER_CODE = process.env.NEXT_PUBLIC_GOATCOUNTER ?? "";

export const hasContactForm = FORM_ENDPOINT.length > 0;
export const hasAnalytics = GOATCOUNTER_CODE.length > 0;
