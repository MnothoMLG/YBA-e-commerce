import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-yba-line w-full bg-yba-paper">
      <div className="content-container flex flex-col w-full">
        {/* Top — wordmark + link columns */}
        <div className="flex flex-col gap-y-16 small:flex-row items-start justify-between pt-20 pb-16">
          <div className="flex flex-col gap-y-4">
            <LocalizedClientLink
              href="/"
              className="font-display text-6xl leading-none tracking-[0.12em] text-yba-ink"
            >
              YBA
            </LocalizedClientLink>
            <p className="yba-eyebrow max-w-[16rem] !tracking-[0.14em] leading-relaxed">
              A minimal wardrobe for the road ahead.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-14 gap-y-10">
            {productCategories && productCategories.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <span className="yba-eyebrow">Shop</span>
                <ul className="flex flex-col gap-y-3" data-testid="footer-categories">
                  {productCategories
                    .filter((c) => !c.parent_category)
                    .slice(0, 6)
                    .map((c) => (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="text-sm text-yba-ink hover:opacity-60 transition-opacity"
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <span className="yba-eyebrow">Collections</span>
                <ul className="flex flex-col gap-y-3">
                  {collections.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-sm text-yba-ink hover:opacity-60 transition-opacity"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-y-4">
              <span className="yba-eyebrow">Info</span>
              <ul className="flex flex-col gap-y-3">
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="text-sm text-yba-ink hover:opacity-60 transition-opacity"
                  >
                    Stores
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account"
                    className="text-sm text-yba-ink hover:opacity-60 transition-opacity"
                  >
                    Account
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/"
                    className="text-sm text-yba-ink hover:opacity-60 transition-opacity"
                  >
                    Manifesto
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-y-3 small:flex-row w-full mb-10 pt-8 border-t border-yba-line justify-between items-start small:items-center">
          <span className="yba-eyebrow">
            © {new Date().getFullYear()} YBA — All rights reserved
          </span>
          <span className="yba-eyebrow">Designed in South Africa</span>
        </div>
      </div>
    </footer>
  )
}
