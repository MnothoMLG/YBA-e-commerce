"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { findPepStores, setPepStore, PepStore } from "@lib/data/pep"
import MedusaRadio from "@modules/common/components/radio"
import { clx, Text } from "@modules/common/components/ui"
import { useEffect, useState } from "react"

function buildAddress(a?: HttpTypes.StoreCartAddress | null): string {
  if (!a) return ""
  return [a.address_1, a.address_2, a.city, a.province, a.postal_code, "South Africa"]
    .filter(Boolean)
    .join(", ")
}

type Props = {
  cart: HttpTypes.StoreCart
  onSelect: (store: PepStore | null) => void
}

const PepStorePicker: React.FC<Props> = ({ cart, onSelect }) => {
  const initial =
    ((cart.metadata as Record<string, unknown> | undefined)?.pep_store as
      | PepStore
      | undefined) ?? null

  const [stores, setStores] = useState<PepStore[]>(initial ? [initial] : [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(
    initial?.place_id ?? null
  )

  const address = buildAddress(cart.shipping_address)

  // Report any pre-existing selection upward on mount
  useEffect(() => {
    onSelect(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!address) {
      setError("Add your delivery address above to find nearby PEP stores.")
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    findPepStores(address)
      .then((res) => {
        if (cancelled) return
        const list = res.stores ?? []
        setStores(list)
        if (!list.length) {
          setError(
            res.message ??
              "No PEP stores found within 30km of your address."
          )
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Could not load PEP stores.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [address])

  const choose = async (store: PepStore) => {
    setSelectedId(store.place_id)
    onSelect(store)
    await setPepStore(store).catch(() => {})
  }

  return (
    <div className="mt-2">
      <div className="flex flex-col">
        <span className="yba-eyebrow">Select a PEP store</span>
        <span className="mb-4 mt-1 text-yba-muted text-sm">
          Choose a PEP store within 30km. We&apos;ll deliver your parcel there
          for collection.
        </span>
      </div>

      {loading && (
        <div className="flex items-center gap-x-2 text-yba-muted text-sm py-4">
          <Loader className="animate-spin" /> Finding PEP stores near you…
        </div>
      )}

      {!loading && error && (
        <Text className="text-sm text-yba-muted py-2" data-testid="pep-error">
          {error}
        </Text>
      )}

      {!loading && stores.length > 0 && (
        <RadioGroup
          value={selectedId}
          onChange={(placeId: string) => {
            const store = stores.find((s) => s.place_id === placeId)
            if (store) choose(store)
          }}
        >
          <div className="max-h-80 overflow-y-auto flex flex-col gap-y-2 pr-1">
            {stores.map((store) => (
              <Radio
                key={store.place_id}
                value={store.place_id}
                data-testid="pep-store-option"
                className={clx(
                  "flex items-start justify-between cursor-pointer py-4 px-6 border border-yba-line hover:border-yba-ink transition-colors",
                  {
                    "border-yba-ink": store.place_id === selectedId,
                  }
                )}
              >
                <div className="flex items-start gap-x-4">
                  <MedusaRadio checked={store.place_id === selectedId} />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold uppercase tracking-[0.01em] text-yba-ink">
                      {store.name}
                    </span>
                    <span className="text-sm text-yba-muted">
                      {store.address}
                    </span>
                  </div>
                </div>
                <span className="yba-eyebrow whitespace-nowrap pl-3">
                  {store.distance_km} km
                </span>
              </Radio>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  )
}

export default PepStorePicker
