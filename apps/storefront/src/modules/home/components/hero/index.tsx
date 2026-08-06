import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="w-full border-b border-yba-line bg-yba-paper">
      <div className="content-container py-20 small:py-28">
        {/* eyebrow */}
        <span className="yba-eyebrow">&quot;01 — The Label&quot;</span>

        <div className="mt-6 grid grid-cols-1 gap-y-10 small:grid-cols-12 small:gap-x-10 items-end">
          {/* Headline */}
          <div className="small:col-span-7 small:pr-4">
            <h1 className="yba-display text-[clamp(3.25rem,10vw,7.25rem)] leading-[0.86]">
              Built
              <br />
              for the Road
            </h1>
          </div>

          {/* Editorial column */}
          <div className="small:col-span-5 small:pb-3">
            <p className="text-base text-yba-muted leading-relaxed max-w-md">
              Precision-cut essentials built for movement. A restrained
              palette, considered proportions, and materials chosen to last —
              menswear and womenswear made to be worn every day.
            </p>
            <LocalizedClientLink
              href="/store"
              className="group mt-8 inline-flex items-center gap-x-3 border border-yba-ink px-6 py-3 hover:bg-yba-ink hover:text-yba-paper transition-colors duration-200"
            >
              <span className="yba-eyebrow !text-current">
                Shop the Collection
              </span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
