"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"
import { updateCart } from "./cart"

export type PepStore = {
  name: string
  address: string
  place_id: string
  location: { lat: number; lng: number }
  distance_km: number
}

type PepStoresResponse = {
  stores: PepStore[]
  count?: number
  message?: string
  formatted_address?: string
  radius_km?: number
}

/**
 * Calls the backend PEP store finder (Google Geocoding + Places) for stores
 * within 30km of the given free-text address.
 */
export async function findPepStores(
  address: string
): Promise<PepStoresResponse> {
  const headers = { ...(await getAuthHeaders()) }

  return sdk.client
    .fetch<PepStoresResponse>("/store/pep-stores", {
      method: "GET",
      query: { address },
      headers,
    })
    .catch((e: any) => ({
      stores: [],
      message:
        e?.message ?? "Could not load nearby PEP stores. Please try again.",
    }))
}

/**
 * Persists the chosen PEP store on the cart metadata so it travels with the
 * order for manual fulfilment.
 */
export async function setPepStore(store: PepStore | null) {
  return updateCart({
    metadata: { pep_store: store ? (store as unknown as Record<string, unknown>) : null },
  } as any)
}
