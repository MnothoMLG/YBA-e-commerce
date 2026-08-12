import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import ProductGrid from "@modules/home/components/product-grid"
import Hero from "@modules/home/components/hero"
import BrandPanels from "@modules/home/components/brand-panels"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "YBA — Built for the Road",
  description:
    "YBA. Precision-cut menswear and womenswear essentials. Minimal, considered, made to be worn every day.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      fields: "*variants.calculated_price,*collection,*categories,*type,+thumbnail,+images",
    } as any,
  })

  return (
    <>
      <Hero image={products?.[0]?.thumbnail || products?.[0]?.images?.[0]?.url} />
      <ProductGrid region={region} products={products || []} />
      <BrandPanels products={products || []} />
      {collections?.length ? (
        <ul className="flex flex-col border-t border-yba-line">
          <FeaturedProducts collections={collections.slice(0, 1)} region={region} />
        </ul>
      ) : null}
    </>
  )
}
