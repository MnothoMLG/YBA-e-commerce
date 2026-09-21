import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  // Temporarily disabled. Keep the integrations configured so they can be
  // restored without changing existing Medusa fulfillment or payment data.
  const enabledShippingMethods = shippingMethods.filter(
    (method) => !/paxi|pep/i.test(method.name ?? "")
  )
  const enabledPaymentMethods = paymentMethods.filter(
    (method) => !method.id.startsWith("pp_system_default")
  )

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping
        cart={cart}
        availableShippingMethods={enabledShippingMethods}
      />

      <Payment cart={cart} availablePaymentMethods={enabledPaymentMethods} />

      <Review cart={cart} />
    </div>
  )
}
