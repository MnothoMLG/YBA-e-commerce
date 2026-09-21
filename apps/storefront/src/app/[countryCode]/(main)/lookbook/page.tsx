import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ShopTheLook from "@modules/lookbook/components/shop-the-look"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Shop complete YBA looks from the latest release.",
}

export default async function LookbookPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  if (!region) return null

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 4,
      fields:
        "id,title,thumbnail,*images,*options,*variants,+variants.inventory_quantity",
    } as any,
  })

  const shoppableProducts = products.filter((product) =>
    product.variants?.some(
      (variant) =>
        !variant.manage_inventory ||
        variant.allow_backorder ||
        (variant.inventory_quantity ?? 0) > 0
    )
  )

  if (!shoppableProducts.length) return null

  return (
    <main className="bg-yba-paper">
      <header className="yba-page-shell border-b border-black pb-12 pt-16 small:pb-24 small:pt-28">
        <p className="yba-eyebrow">&quot;Release 00.41&quot;</p>
        <h1 className="yba-display mt-5 text-[clamp(3.5rem,18vw,12rem)] small:mt-7">
          Lookbook
        </h1>
      </header>
      <section className="yba-page-shell grid gap-10 py-10 small:grid-cols-[minmax(0,1.6fr)_minmax(20rem,0.7fr)] small:py-16">
        <div className="grid grid-cols-2 gap-2 small:gap-4">
          {shoppableProducts.map((product, index) => {
            const image = product.thumbnail ?? product.images?.[0]?.url
            return (
              <div
                key={product.id}
                className={`relative aspect-[4/5] overflow-hidden bg-black/5 ${
                  index === 0 ? "col-span-2" : ""
                }`}
              >
                {image && (
                  <Image
                    src={image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes={index === 0 ? "100vw" : "50vw"}
                    priority={index === 0}
                  />
                )}
              </div>
            )
          })}
        </div>
        <aside className="small:sticky small:top-36 small:self-start">
          <p className="yba-eyebrow">Shop the look</p>
          <h2 className="mt-4 font-display text-5xl uppercase leading-[0.9]">
            The full edit
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-black/60">
            Choose a variant for each piece, then add the complete look to your
            bag in one step.
          </p>
          <div className="mt-8">
            <ShopTheLook products={shoppableProducts} />
          </div>
        </aside>
      </section>
    </main>
  )
}
