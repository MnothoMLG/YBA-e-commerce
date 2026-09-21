"use client"

import { addItemsToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"

const isAvailable = (variant: HttpTypes.StoreProductVariant) =>
  !variant.manage_inventory ||
  variant.allow_backorder ||
  (variant.inventory_quantity ?? 0) > 0

export default function ShopTheLook({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) {
  const countryCode = useParams().countryCode as string
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      products.flatMap((product) => {
        const availableVariants = product.variants?.filter(isAvailable) ?? []
        return availableVariants.length === 1
          ? [[product.id, availableVariants[0].id]]
          : []
      })
    )
  )
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ready = useMemo(
    () => products.every((product) => selectedVariants[product.id]),
    [products, selectedVariants]
  )

  const addLook = async () => {
    if (!ready) {
      setError("Choose a size for every piece")
      return
    }

    setIsAdding(true)
    setError(null)
    try {
      await addItemsToCart({
        countryCode,
        items: products.map((product) => ({
          variantId: selectedVariants[product.id],
        })),
      })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not add look")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="border-t border-black pt-7">
      <div className="space-y-7">
        {products.map((product) => {
          const variants = product.variants?.filter(isAvailable) ?? []
          return (
            <fieldset key={product.id}>
              <legend className="font-sans text-sm font-semibold uppercase">
                {product.title}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() =>
                      setSelectedVariants((current) => ({
                        ...current,
                        [product.id]: variant.id,
                      }))
                    }
                    className={`min-h-11 border px-4 font-mono text-[10px] uppercase tracking-[0.16em] ${
                      selectedVariants[product.id] === variant.id
                        ? "border-black bg-black text-white"
                        : "border-black/30 bg-white text-black"
                    }`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </fieldset>
          )
        })}
      </div>
      {error && <p className="mt-5 text-sm text-black/60">{error}</p>}
      <Button
        className="mt-7 min-h-12 w-full"
        onClick={addLook}
        disabled={!ready || isAdding}
        isLoading={isAdding}
      >
        {ready ? `Add all ${products.length} pieces` : "Select all sizes"}
      </Button>
    </div>
  )
}
