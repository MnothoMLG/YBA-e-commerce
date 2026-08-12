import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import { MagnifyingGlass, User } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import YbaLogo from "@modules/common/components/yba-logo"

export default async function Nav({
  countryCode,
}: {
  countryCode?: string
}) {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  // Reflect the currency of the region the visitor is browsing
  const currentRegion = countryCode
    ? regions?.find((r) =>
        r.countries?.some((c) => c.iso_2 === countryCode.toLowerCase())
      )
    : undefined
  const currency = (
    currentRegion?.currency_code ??
    regions?.[0]?.currency_code ??
    "usd"
  ).toUpperCase()

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-24 border-b border-black bg-white duration-200 small:h-32">
        <nav className="flex h-full w-full items-center justify-between px-5 small:px-12">
          <div className="flex-1 basis-0 h-full flex items-center gap-x-7">
            <div className="h-full flex items-center">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
          </div>

          {/* Center — YBA logo */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              data-testid="nav-store-link"
              className="hover:opacity-70 transition-opacity"
              aria-label="YBA home"
            >
              <YbaLogo className="h-16 w-auto small:h-20" priority />
            </LocalizedClientLink>
          </div>

          {/* Right — utility */}
          <div className="flex-1 basis-0 h-full flex items-center justify-end gap-x-4 small:gap-x-6">
            <LocalizedClientLink href="/store" aria-label="Search products" className="hidden hover:opacity-60 xsmall:block">
              <MagnifyingGlass className="h-6 w-6" />
            </LocalizedClientLink>
            <span className="yba-eyebrow hidden small:inline">{currency}</span>
            <LocalizedClientLink
              href="/account"
              data-testid="nav-account-link"
              className="hidden hover:opacity-60 transition-opacity xsmall:block"
              aria-label="Account"
            >
              <User className="h-6 w-6" />
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  data-testid="nav-cart-link"
                  className="yba-eyebrow !text-black hover:underline underline-offset-4 transition-all"
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
