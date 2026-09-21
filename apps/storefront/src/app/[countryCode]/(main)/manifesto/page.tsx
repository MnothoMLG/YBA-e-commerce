import { Metadata } from "next"

const principles = [
  {
    number: "01",
    label: "Origins",
    title: "Cultural inheritance",
    copy: "Born and raised in Limpopo, in a township called Seshego, YBA carries the discipline, humour and visual language of home into every garment. Johannesburg gave the label its pace; Seshego gave it its point of view.",
  },
  {
    number: "02",
    label: "Inspiration",
    title: "From F1 racing to the streets",
    copy: "Sponsor badges, pit-lane uniforms and the silhouette of the Kyalami circuit become a new local uniform. We borrow the energy of racing, then rebuild it for the people moving the city forward.",
  },
  {
    number: "03",
    label: "Practice",
    title: "Make less. Mean more.",
    copy: "Small runs, durable construction and recovered materials keep each release intentional. Clothes should gather stories, not become waste after a season.",
  },
]

export const metadata: Metadata = {
  title: "Manifesto",
  description: "Born in Seshego. Made in Jozi. The YBA manifesto.",
}

export default function ManifestoPage() {
  return (
    <div className="bg-yba-paper">
      <header className="yba-page-shell flex min-h-[calc(100vh-7rem)] flex-col justify-center border-b border-black py-20">
        <p className="yba-eyebrow">&quot;Manifesto&quot;</p>
        <h1 className="yba-display mt-8 max-w-[11ch] text-[clamp(4.5rem,10vw,11rem)]">
          Born in <span className="italic">Seshego.</span>
          <br />Made in Jozi.
        </h1>
      </header>

      <main>
        {principles.map((principle, index) => (
          <section
            key={principle.number}
            className={index === 1 ? "bg-black text-white" : "bg-yba-paper"}
          >
            <div className="yba-page-shell grid min-h-[70vh] gap-14 border-b border-current/30 py-20 small:grid-cols-2 small:items-center small:py-28">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] opacity-60">
                  &quot;{principle.number} — {principle.label}&quot;
                </p>
                <h2 className="mt-7 max-w-[11ch] font-display text-[clamp(3.5rem,7vw,8rem)] uppercase leading-[0.88] tracking-[-0.03em]">
                  {principle.title}
                </h2>
              </div>
              <div className="flex small:justify-end">
                <p className="max-w-2xl text-xl leading-relaxed opacity-75 small:text-2xl small:leading-relaxed">
                  {principle.copy}
                </p>
              </div>
            </div>
          </section>
        ))}
      </main>

      <section className="bg-black px-5 py-24 text-center text-white small:px-12 small:py-36">
        <p className="mx-auto max-w-5xl font-serif text-4xl italic leading-tight small:text-6xl">
          “Made for the originals. The young, cool kings and queens who are not
          afraid to make a statement.”
        </p>
      </section>
    </div>
  )
}
