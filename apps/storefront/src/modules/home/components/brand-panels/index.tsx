import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function BrandPanels({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) {
  const images = products
    .map((product) => product.thumbnail || product.images?.[0]?.url)
    .filter(Boolean) as string[]

  return (
    <>
      <section className="border-b border-yba-line px-5 py-16 small:px-12 small:py-28">
        <span className="yba-eyebrow">&quot;Featured collections&quot;</span>
        <h2 className="yba-display mt-5 text-[clamp(3rem,7vw,7rem)]">Enter the archive</h2>
        <div className="mt-12 grid gap-4 small:grid-cols-3">
          {["New arrivals", "Essentials", "Limited edition"].map((label, index) => (
            <LocalizedClientLink
              key={label}
              href="/store"
              className="group relative aspect-[4/5] overflow-hidden bg-neutral-900"
            >
              {images[index] ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${images[index]})` }}
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white small:p-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Collection</span>
                <h3 className="mt-2 font-display text-4xl uppercase leading-[0.9] small:text-5xl">{label}</h3>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </section>

      <section className="grid min-h-[80vh] bg-black text-white small:grid-cols-2">
        <div className="flex flex-col justify-between border-b border-white/20 p-6 small:border-b-0 small:border-r small:p-12">
          <span className="font-mono text-xs uppercase tracking-[0.26em] text-white/60">&quot;Made for the originals&quot;</span>
          <h2 className="font-display text-[clamp(4rem,9vw,9rem)] uppercase leading-[0.82]">
            Not just clothes. A lifestyle.
          </h2>
        </div>
        <div className="flex items-center p-6 small:p-16">
          <div>
            <p className="max-w-2xl font-serif text-3xl italic leading-snug small:text-5xl">
              “YBA is for trendsetters who pride themselves in standing out for all the right reasons — the young, cool kings and queens who are not afraid to make a statement.”
            </p>
            <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-white/60">— YBA, Johannesburg</p>
          </div>
        </div>
      </section>
    </>
  )
}
