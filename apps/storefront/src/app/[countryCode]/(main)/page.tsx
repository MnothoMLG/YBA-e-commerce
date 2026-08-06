import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import ProductGrid from "@modules/home/components/product-grid"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <ProductGrid region={region} />
      {collections?.length ? (
        <ul className="flex flex-col">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      ) : null}
    </>
  )
}
