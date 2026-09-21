import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductGrid({
  region,
  products,
  eyebrow = "New Arrivals",
  title = "Fresh from the atelier",
}: {
  region: HttpTypes.StoreRegion
  products: HttpTypes.StoreProduct[]
  eyebrow?: string
  title?: string
}) {
  if (!products?.length) {
    return null
  }

  return (
    <section className="border-b border-yba-line px-4 py-14 xsmall:px-5 small:px-12 small:py-28">
      {/* Section header — editorial */}
      <div className="mb-12 small:mb-16">
        <span className="yba-eyebrow">&quot;{eyebrow}&quot;</span>
        <div className="mt-3 flex items-end justify-between gap-x-6">
          <h2 className="yba-display max-w-5xl text-[clamp(2.5rem,12vw,7.5rem)]">{title}</h2>
          <LocalizedClientLink
            href="/store"
            className="group hidden xsmall:inline-flex items-center gap-x-2 whitespace-nowrap pb-2"
          >
            <span className="yba-eyebrow !text-yba-ink">View All</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </LocalizedClientLink>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-2 gap-y-10 xsmall:gap-x-3 small:grid-cols-4 small:gap-x-10 small:gap-y-16">
        {products.slice(0, 4).map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </section>
  )
}
