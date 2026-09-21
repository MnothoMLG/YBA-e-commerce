"use server"

import { updateCart } from "./cart"

export type PepStore = {
  name: string
  address: string
  place_id: string
  location: { lat: number; lng: number }
  distance_km: number
}

export type DeliveryDestination =
  | ({ type: "pep_store" } & PepStore)
  | {
      type: "shipping_address"
      address: {
        address_1?: string | null
        address_2?: string | null
        city?: string | null
        province?: string | null
        postal_code?: string | null
        country_code?: string | null
      }
    }

/**
 * Persists the chosen PEP store on the cart metadata so it travels with the
 * order for manual fulfilment.
 */
export async function setPepStore(store: PepStore | null) {
  return updateCart({
    metadata: {
      pep_store: store ? (store as unknown as Record<string, unknown>) : null,
      delivery_destination: store
        ? ({
            type: "pep_store",
            ...store,
          } satisfies DeliveryDestination)
        : null,
    },
  } as any)
}

export async function setShippingAddressDestination(
  address: DeliveryDestination & { type: "shipping_address" }
) {
  return updateCart({
    metadata: {
      pep_store: null,
      delivery_destination: address,
    },
  } as any)
}
