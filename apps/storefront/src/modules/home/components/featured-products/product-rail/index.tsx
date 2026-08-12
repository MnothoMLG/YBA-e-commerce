import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-16 small:py-24">
      {/* Section header — editorial */}
      <div className="mb-10">
        <span className="yba-eyebrow">&quot;New Arrivals&quot;</span>
        <div className="mt-3 flex items-end justify-between gap-x-6">
          <h2 className="yba-display text-5xl small:text-7xl">
            {collection.title}
          </h2>
          <LocalizedClientLink
            href={`/collections/${collection.handle}`}
            className="group hidden xsmall:inline-flex items-center gap-x-2 whitespace-nowrap pb-2"
          >
            <span className="yba-eyebrow !text-yba-ink">View All</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </LocalizedClientLink>
        </div>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-12 small:gap-x-6 small:gap-y-16">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
