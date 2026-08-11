"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import {
  ArrowRightMini,
  BarsThree,
  House,
  ShoppingBag,
  ShoppingCart,
  User,
  XMark,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"
import { Fragment } from "react"
import YbaLogo from "@modules/common/components/yba-logo"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { Locale } from "@lib/data/locales"


const sideMenuItems = [
  { name: "Home", href: "/", icon: House },
  { name: "Store", href: "/store", icon: ShoppingBag },
  { name: "Account", href: "/account", icon: User },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                  className="my-2 inline-flex min-h-11 items-center text-black transition-opacity hover:opacity-60 focus:outline-none"
                >
                  <BarsThree className="h-8 w-8" aria-hidden="true" />
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/70 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-2xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="fixed inset-y-0 left-0 z-[51] flex w-[min(92vw,28rem)] flex-col text-sm text-white shadow-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex h-full flex-col justify-between border-r-2 border-white bg-black p-6 small:p-8"
                  >
                    <div className="flex items-center justify-between border-b border-white pb-5" id="xmark">
                      <YbaLogo className="h-12 w-auto invert" />
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        aria-label="Close navigation menu"
                        className="inline-flex h-11 w-11 items-center justify-center border-2 border-white transition-colors hover:bg-white hover:text-black"
                      >
                        <XMark className="h-6 w-6" />
                      </button>
                    </div>
                    <ul className="flex flex-col items-stretch">
                      {sideMenuItems.map(({ name, href, icon: Icon }) => {
                        return (
                          <li key={name} className="border-b border-white">
                            <LocalizedClientLink
                              href={href}
                              className="group flex items-center justify-between py-5 text-2xl font-semibold uppercase tracking-tight transition-colors hover:bg-white hover:text-black"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              <span className="flex items-center gap-x-4">
                                <Icon className="h-6 w-6" aria-hidden="true" />
                                {name}
                              </span>
                              <ArrowRightMini className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="flex flex-col gap-y-5 border-t border-white pt-5">
                      {!!locales?.length && (
                        <div
                            className="flex justify-between border-b border-white pb-4"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex justify-between border-b border-white pb-4"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="flex justify-between font-mono text-xs uppercase tracking-wider">
                        © {new Date().getFullYear()} YBA. All rights
                        reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
