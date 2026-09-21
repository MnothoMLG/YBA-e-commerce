import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Stores",
  description: "Find YBA in Johannesburg.",
}

export default function StoresPage() {
  return (
    <main className="bg-yba-paper">
      <header className="yba-page-shell border-b border-black pb-16 pt-24 small:pb-24 small:pt-28">
        <p className="yba-eyebrow">&quot;Stockists&quot;</p>
        <h1 className="yba-display mt-7 text-[clamp(4.5rem,12vw,12rem)]">
          Stores
        </h1>
      </header>
      <section className="yba-page-shell grid min-h-[55vh] gap-12 py-16 small:grid-cols-[1fr_2fr] small:items-start small:py-24">
        <p className="yba-eyebrow">01 — Johannesburg</p>
        <div className="border-t border-black pt-7">
          <h2 className="font-display text-4xl uppercase leading-none small:text-6xl">
            99 Design Store
          </h2>
          <address className="mt-8 font-mono text-sm not-italic uppercase leading-relaxed tracking-[0.18em]">
            99 Juta Street<br />
            Braamfontein, Johannesburg<br />
            Gauteng, South Africa
          </address>
        </div>
      </section>
    </main>
  )
}
