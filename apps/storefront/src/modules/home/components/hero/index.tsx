import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = ({ image }: { image?: string | null }) => {
  return (
    <>
      <section
        className="relative flex min-h-[70svh] items-end overflow-hidden border-b border-yba-line bg-neutral-900 bg-cover bg-center small:min-h-[78svh] medium:min-h-[calc(100svh-7rem)]"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/10" />
        <div className="content-container relative z-10 flex flex-col items-center pb-8 text-center xsmall:pb-12 small:pb-16">
          <LocalizedClientLink
            href="/store"
            className="w-full max-w-xs bg-white px-8 py-4 font-sans text-sm font-bold uppercase tracking-[0.04em] text-black transition-colors hover:bg-black hover:text-white xsmall:w-auto small:px-16 small:py-5"
          >
            Shop now
          </LocalizedClientLink>
          <span className="mt-4 max-w-full bg-black/60 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white backdrop-blur-sm xsmall:px-5 xsmall:text-[10px] xsmall:tracking-[0.28em] small:mt-5 small:text-xs">
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
