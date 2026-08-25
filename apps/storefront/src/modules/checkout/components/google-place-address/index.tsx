"use client"

import {
  loadPlacesLibrary,
  SelectedGooglePlace,
} from "@lib/google-places-client"
import { useEffect, useRef, useState } from "react"

export type GooglePlaceAddress = {
  address1: string
  city: string
  province: string
  postalCode: string
  countryCode: string
  placeId: string
  lat: number
  lng: number
}

type PlaceSelectEvent = Event & {
  placePrediction?: { toPlace: () => SelectedGooglePlace }
}

const GooglePlaceAddressInput = ({
  onSelect,
}: {
  onSelect: (address: GooglePlaceAddress) => void
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let cancelled = false
    let autocomplete: HTMLElement | null = null

    loadPlacesLibrary()
      .then((places) => {
        if (cancelled || !containerRef.current) return
        const element = new places.PlaceAutocompleteElement({
          includedRegionCodes: ["za"],
          requestedRegion: "za",
        })
        autocomplete = element
        element.className = "block w-full"
        element.setAttribute("placeholder", "Start typing your address")
        element.setAttribute("aria-label", "Find your shipping address")
        element.addEventListener("gmp-select", async (event) => {
          try {
            const place = (event as PlaceSelectEvent).placePrediction?.toPlace()
            if (!place) return
            await place.fetchFields({
              fields: [
                "id",
                "formattedAddress",
                "addressComponents",
                "location",
              ],
            })
            const component = (type: string) =>
              place.addressComponents?.find((item) => item.types.includes(type))
            const address1 = [
              component("street_number")?.longText,
              component("route")?.longText,
            ]
              .filter(Boolean)
              .join(" ")
            if (!place.id || !place.location)
              throw new Error("Choose an address with a precise location.")
            onSelect({
              address1: address1 || place.formattedAddress || "",
              city:
                component("locality")?.longText ??
                component("administrative_area_level_2")?.longText ??
                "",
              province:
                component("administrative_area_level_1")?.longText ?? "",
              postalCode: component("postal_code")?.longText ?? "",
              countryCode:
                component("country")?.shortText?.toLowerCase() ?? "za",
              placeId: place.id,
              lat: place.location.lat(),
              lng: place.location.lng(),
            })
            setError(null)
          } catch (e) {
            setError(
              e instanceof Error ? e.message : "Could not load that address."
            )
          }
        })
        containerRef.current.replaceChildren(element)
      })
      .catch((e: Error) => setError(e.message))

    return () => {
      cancelled = true
      autocomplete?.remove()
    }
  }, [onSelect])

  return (
    <div className="col-span-2 flex flex-col gap-y-1">
      <span className="txt-compact-medium text-ui-fg-subtle">
        Find your address with Google
      </span>
      <div ref={containerRef} className="min-h-11 w-full" />
      {error && <span className="text-sm text-rose-500">{error}</span>}
    </div>
  )
}

export default GooglePlaceAddressInput
