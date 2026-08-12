import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Editorial SKU code + category label derived from product data
  const sku = `YBA-${(product.id || "000").slice(-3).toUpperCase()}`
  const category =
    product.collection?.title ||
    (product as any).type?.value ||
    product.categories?.[0]?.name ||
    "Essentials"

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        {/* Image with SKU overlay */}
        <div className="relative overflow-hidden bg-yba-paper2">
          <span className="yba-eyebrow absolute left-3 top-3 z-10 bg-yba-paper/80 px-2 py-1 backdrop-blur-sm">
            {sku}
          </span>
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 flex items-start justify-between gap-x-3">
          <div className="flex flex-col gap-y-1">
            <span className="yba-eyebrow">{category}</span>
            <h3
              className="text-sm font-semibold uppercase tracking-[0.01em] text-yba-ink"
              data-testid="product-title"
            >
              {product.title}
            </h3>
          </div>
          <div className="flex items-center gap-x-2 pt-4">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
