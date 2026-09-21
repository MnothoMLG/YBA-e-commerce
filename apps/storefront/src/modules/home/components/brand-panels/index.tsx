import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function BrandPanels({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) {
  const images = products
    .flatMap((product) => [
      product.thumbnail,
      ...(product.images?.map((image) => image.url) || []),
    ])
    .filter(Boolean) as string[]

  const imageAt = (index: number) => images[index % Math.max(images.length, 1)]

  return (
    <>
      <section className="border-b border-yba-line px-4 py-14 xsmall:px-5 small:px-12 small:py-28">
        <span className="yba-eyebrow">&quot;Featured collections&quot;</span>
        <h2 className="yba-display mt-5 text-[clamp(2.5rem,12vw,7rem)]">
          Enter the archive
        </h2>
        <div className="mt-12 grid gap-4 small:grid-cols-3">
          {["New arrivals", "Essentials", "Limited edition"].map(
            (label, index) => (
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
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
                    Collection
                  </span>
                  <h3 className="mt-2 font-display text-4xl uppercase leading-[0.9] small:text-5xl">
                    {label}
                  </h3>
                </div>
              </LocalizedClientLink>
            ),
          )}
        </div>
      </section>

      <section className="overflow-hidden border-b border-yba-line py-16 small:py-28">
        <div className="flex items-end justify-between gap-8 px-5 small:px-12">
          <div>
            <span className="yba-eyebrow">&quot;Campaign journal&quot;</span>
            <h2 className="yba-display mt-5 text-[clamp(2.5rem,12vw,7rem)]">
              Scenes from the city
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
            className="yba-editorial-link hidden shrink-0 small:inline-flex"
          >
            Explore the edit →
          </LocalizedClientLink>
        </div>

        <div className="mt-12 grid grid-cols-12 items-end gap-3 px-5 small:mt-16 small:gap-6 small:px-12">
          <LocalizedClientLink
            href="/store"
            className="group relative col-span-7 aspect-[4/5] overflow-hidden bg-yba-paper2 small:col-span-4"
          >
            {imageAt(3) && (
              <div
                className="yba-campaign-image absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageAt(3)})` }}
              />
            )}
            <span className="absolute bottom-4 left-4 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-black">
              Look 01 / Street
            </span>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/store"
            className="group relative col-span-5 mb-12 aspect-[3/4] overflow-hidden bg-yba-paper2 small:col-span-3 small:mb-24"
          >
            {imageAt(5) && (
              <div
                className="yba-campaign-image absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageAt(5)})` }}
              />
            )}
          </LocalizedClientLink>

          <div className="col-span-12 mt-4 small:col-span-5 small:mt-0">
            <LocalizedClientLink
              href="/store"
              className="group relative block aspect-[16/11] overflow-hidden bg-yba-paper2"
            >
              {imageAt(7) && (
                <div
                  className="yba-campaign-image absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageAt(7)})` }}
                />
              )}
            </LocalizedClientLink>
            <div className="mt-5 flex items-start justify-between gap-6">
              <p className="max-w-sm text-sm leading-relaxed text-black/60">
                Sharp silhouettes, confident layers and limited-run pieces made
                for nights that become mornings.
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                JHB / 26
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[78vh] overflow-hidden bg-black text-white">
        {imageAt(9) && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageAt(9)})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative flex min-h-[78vh] flex-col justify-between p-6 small:p-12">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-white/75">
            &quot;After dark — Johannesburg&quot;
          </span>
          <div className="max-w-6xl">
            <h2 className="font-display text-[clamp(3rem,14vw,9rem)] uppercase leading-[0.84]">
              Luxury with a pulse.
            </h2>
            <LocalizedClientLink
              href="/store"
              className="mt-10 inline-flex bg-white px-8 py-5 font-mono text-xs uppercase tracking-[0.24em] text-black transition-colors hover:bg-black hover:text-white"
            >
              Shop the night edit
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      <section className="grid min-h-[80vh] bg-black text-white small:grid-cols-2">
        <div className="flex flex-col justify-between border-b border-white/20 p-6 small:border-b-0 small:border-r small:p-12">
          <span className="font-mono text-xs uppercase tracking-[0.26em] text-white/60">
            &quot;Made for the originals&quot;
          </span>
          <h2 className="my-20 font-display text-[clamp(3rem,14vw,9rem)] uppercase leading-[0.84] small:my-0">
            Not just clothes. A lifestyle.
          </h2>
        </div>
        <div className="flex items-center p-6 small:p-16">
          <div>
            <p className="max-w-2xl font-serif text-3xl italic leading-snug small:text-5xl">
              “YBA is for trendsetters who pride themselves in standing out for
              all the right reasons — the young, cool kings and queens who are
              not afraid to make a statement.”
            </p>
            <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-white/60">
              — YBA, Johannesburg
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
