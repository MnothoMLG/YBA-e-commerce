import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = ({ image }: { image?: string | null }) => {
  return (
    <>
      <section
        className="relative flex min-h-[72vh] items-end overflow-hidden border-b border-yba-line bg-neutral-900 bg-cover bg-center small:min-h-[calc(100vh-7.5rem)]"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/10" />
        <div className="content-container relative z-10 flex flex-col items-center pb-12 text-center small:pb-16">
          <LocalizedClientLink
            href="/store"
            className="bg-white px-10 py-5 font-sans text-sm font-bold uppercase tracking-[0.04em] text-black transition-colors hover:bg-black hover:text-white small:px-16"
          >
            Shop now
          </LocalizedClientLink>
          <span className="mt-5 bg-black/60 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white backdrop-blur-sm small:text-xs">
            SS26 · Release [00.41_Kyalami]
          </span>
        </div>
      </section>
      <div className="overflow-hidden bg-black py-5 text-white">
        <div
          className="yba-marquee flex w-max"
          aria-label="Yung Blood Apparel campaign announcement"
        >
          {[0, 1].map((copy) => (
            <p
              key={copy}
              className="shrink-0 whitespace-nowrap pr-16 font-mono text-[10px] uppercase tracking-[0.28em] small:text-xs"
              aria-hidden={copy === 1}
            >
              ◆ &nbsp; Yung Blood Apparel — Kyalami SS26 — From the circuit to
              the streets — Est. Johannesburg &nbsp; ◆ &nbsp; Yung Blood Apparel
              — Kyalami SS26
            </p>
          ))}
        </div>
      </div>
    </>
  )
}

export default Hero
