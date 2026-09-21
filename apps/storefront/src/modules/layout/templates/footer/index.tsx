import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import YbaLogo from "@modules/common/components/yba-logo"

export default async function Footer() {
  const [{ collections }, productCategories] = await Promise.all([
    listCollections({ fields: "id,title,handle" }),
    listCategories(),
  ])

  return (
    <footer className="bg-black text-white">
      <section className="grid gap-10 border-b border-white/20 px-6 py-20 small:grid-cols-2 small:px-12 small:py-28">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-white/60">&quot;Enlist&quot;</span>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(3.5rem,7vw,7rem)] uppercase leading-[0.85]">Join the paddock.</h2>
          <p className="mt-6 max-w-xl text-lg text-white/60">Early access to drops, campaign previews and paddock stories. No spam.</p>
        </div>
        <div className="flex items-center small:justify-end">
          <LocalizedClientLink href="/account" className="border border-white bg-white px-8 py-5 font-mono text-xs uppercase tracking-[0.25em] text-black transition-colors hover:bg-black hover:text-white">
            Create an account
          </LocalizedClientLink>
        </div>
      </section>

      <section className="grid gap-14 border-b border-white/20 px-6 py-16 small:grid-cols-[2fr_1fr_1fr] small:px-12 small:py-24">
        <div>
          <YbaLogo className="h-20 w-auto invert" />
          <p className="mt-10 max-w-lg font-serif text-3xl italic leading-snug">“Made for the originals. The young, cool kings and queens who are not afraid to make a statement.”</p>
          <div className="mt-10 flex gap-7 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
            <span>Instagram</span><span>TikTok</span><span>Twitter</span>
          </div>
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">Shop</span>
          <ul className="mt-7 space-y-4 font-mono text-sm uppercase tracking-[0.18em]">
            <li><LocalizedClientLink href="/store">All pieces</LocalizedClientLink></li>
            {productCategories?.filter((category) => !category.parent_category).slice(0, 3).map((category) => (
              <li key={category.id}><LocalizedClientLink href={`/categories/${category.handle}`}>{category.name}</LocalizedClientLink></li>
            ))}
          </ul>
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">Navigate</span>
          <ul className="mt-7 space-y-4 font-mono text-sm uppercase tracking-[0.18em]">
            <li><LocalizedClientLink href="/stories">Stories</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/manifesto">Manifesto</LocalizedClientLink></li>
            {collections?.slice(0, 4).map((collection) => (
              <li key={collection.id}><LocalizedClientLink href={`/collections/${collection.handle}`}>{collection.title}</LocalizedClientLink></li>
            ))}
            <li><LocalizedClientLink href="/account">Account</LocalizedClientLink></li>
          </ul>
        </div>
      </section>
      <div className="flex flex-col gap-3 px-6 py-7 font-mono text-[10px] uppercase tracking-[0.24em] text-white/60 small:flex-row small:justify-between small:px-12">
        <span>© {new Date().getFullYear()} Yung Blood Apparel</span>
        <span>Johannesburg, South Africa</span>
      </div>
    </footer>
  )
}
