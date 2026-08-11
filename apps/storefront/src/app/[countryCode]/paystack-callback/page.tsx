import { placeOrder } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Paystack returns the customer here after payment (set this URL as the
 * Callback URL in the Paystack dashboard, e.g. https://<domain>/za/paystack-callback).
 *
 * Completing the cart triggers server-side verification of the Paystack
 * transaction; on success `placeOrder` redirects to the order confirmation page.
 */
export default async function PaystackCallbackPage() {
  let errorMessage: string | null = null

  try {
    await placeOrder()
  } catch (e: any) {
    // Let Next.js redirects (success path) propagate
    if (typeof e?.digest === "string" && e.digest.startsWith("NEXT_REDIRECT")) {
      throw e
    }
    errorMessage =
      e?.message ??
      "We couldn't confirm your payment. If you were charged, please contact us."
  }

  return (
    <div className="content-container flex min-h-[60vh] flex-col items-center justify-center gap-y-6 text-center">
      {errorMessage ? (
        <>
          <span className="yba-eyebrow">&quot;Payment&quot;</span>
          <h1 className="yba-display text-4xl small:text-5xl">
            Payment not confirmed
          </h1>
          <p className="max-w-md text-yba-muted">{errorMessage}</p>
          <LocalizedClientLink
            href="/cart"
            className="border border-yba-ink px-6 py-3 yba-eyebrow !text-yba-ink hover:bg-yba-ink hover:text-yba-paper transition-colors"
          >
            Return to Bag
          </LocalizedClientLink>
        </>
      ) : (
        <>
          <span className="yba-eyebrow">&quot;Payment&quot;</span>
          <h1 className="yba-display text-4xl small:text-5xl">
            Finalising your order…
          </h1>
          <p className="max-w-md text-yba-muted">
            Please wait while we confirm your Paystack payment.
          </p>
        </>
      )}
    </div>
  )
}
