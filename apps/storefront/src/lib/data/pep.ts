"use server"

import { updateCart } from "./cart"

export type PepStore = {
  name: string
  address: string
  place_id: string
  location: { lat: number; lng: number }
  distance_km: number
}

/**
 * Persists the chosen PEP store on the cart metadata so it travels with the
 * order for manual fulfilment.
 */
export async function setPepStore(store: PepStore | null) {
  return updateCart({
    metadata: {
      pep_store: store ? (store as unknown as Record<string, unknown>) : null,
    },
  } as any)
}
