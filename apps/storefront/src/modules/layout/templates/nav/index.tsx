import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

const leftLinks = [
  { label: "Shop", href: "/store" },
  { label: "Collection", href: "/store" },
  { label: "Lookbook", href: "/store" },
]

const rightLinks = [
  { label: "Stories", href: "/store" },
  { label: "Stores", href: "/store" },
  { label: "Manifesto", href: "/" },
]

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  const currency = regions?.[0]?.currency_code?.toUpperCase() ?? "USD"

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b border-yba-line bg-yba-paper/90 backdrop-blur-md duration-200">
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Left — categories (desktop) / menu (mobile) */}
          <div className="flex-1 basis-0 h-full flex items-center gap-x-7">
            <div className="small:hidden h-full flex items-center">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
            <ul className="hidden small:flex items-center gap-x-7">
              {leftLinks.map((link) => (
                <li key={link.label}>
                  <LocalizedClientLink
                    href={link.href}
                    className="yba-eyebrow !text-yba-ink hover:opacity-60 transition-opacity"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Center — YBA monogram */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              data-testid="nav-store-link"
              className="font-display text-2xl leading-none tracking-[0.28em] text-yba-ink pl-[0.28em] hover:opacity-70 transition-opacity"
            >
              YBA
            </LocalizedClientLink>
          </div>

          {/* Right — utility */}
          <div className="flex-1 basis-0 h-full flex items-center justify-end gap-x-6">
            <ul className="hidden medium:flex items-center gap-x-7">
              {rightLinks.map((link) => (
                <li key={link.label}>
                  <LocalizedClientLink
                    href={link.href}
                    className="yba-eyebrow !text-yba-ink hover:opacity-60 transition-opacity"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
            <span className="yba-eyebrow hidden small:inline">{currency}</span>
            <LocalizedClientLink
              href="/account"
              data-testid="nav-account-link"
              className="yba-eyebrow !text-yba-ink hover:opacity-60 transition-opacity hidden small:inline"
            >
              Account
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  data-testid="nav-cart-link"
                  className="yba-eyebrow !text-yba-ink hover:opacity-60 transition-opacity"
                >
                  Bag (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
