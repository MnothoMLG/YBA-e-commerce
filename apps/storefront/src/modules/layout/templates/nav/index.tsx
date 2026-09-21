import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import { MagnifyingGlass } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import YbaLogo from "@modules/common/components/yba-logo"

const shopLinks = [
  { label: "Women", href: "/categories/women" },
  { label: "Men", href: "/categories/men" },
  { label: "Kids", href: "/categories/kids" },
  { label: "Collection", href: "/store" },
  { label: "Lookbook", href: "/store" },
]

const editorialLinks = [
  { label: "Stories", href: "/stories" },
  { label: "Stores", href: "/stores" },
  { label: "Manifesto", href: "/manifesto" },
]

const NavLink = ({ label, href }: { label: string; href: string }) => (
  <LocalizedClientLink
    href={href}
    className="group relative py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-black"
  >
    {label}
    <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100" />
  </LocalizedClientLink>
)

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

  const currentRegion = countryCode
    ? regions?.find((region) =>
        region.countries?.some(
          (country) => country.iso_2 === countryCode.toLowerCase()
        )
      )
    : undefined
  const currency = (
    currentRegion?.currency_code ??
    regions?.[0]?.currency_code ??
    "zar"
  ).toUpperCase()

  return (
    <div className="sticky inset-x-0 top-0 z-50">
      <header className="h-24 border-b border-black bg-yba-paper small:h-28">
        <nav className="grid h-full grid-cols-[1fr_auto_1fr] items-center px-5 small:px-8 medium:px-12">
          <div className="flex h-full items-center">
            <div className="small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
            <div className="hidden items-center gap-7 small:flex medium:gap-8 large:gap-10">
              {shopLinks.map((link) => (
                <NavLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          <LocalizedClientLink
            href="/"
            data-testid="nav-store-link"
            className="transition-opacity hover:opacity-65"
            aria-label="YBA home"
          >
            <YbaLogo className="h-14 w-auto small:h-[4.5rem]" priority />
          </LocalizedClientLink>

          <div className="flex h-full items-center justify-end gap-4 small:gap-5 medium:gap-7">
            <div className="hidden items-center gap-7 small:flex medium:gap-8">
              {editorialLinks.map((link) => (
                <NavLink key={link.label} {...link} />
              ))}
            </div>
            <LocalizedClientLink
              href="/store"
              aria-label="Search products"
              className="hidden transition-opacity hover:opacity-60 xsmall:block"
            >
              <MagnifyingGlass className="h-5 w-5" />
            </LocalizedClientLink>
            <span className="yba-eyebrow hidden medium:inline">{currency}</span>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  data-testid="nav-cart-link"
                  className="yba-eyebrow whitespace-nowrap !text-black"
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
