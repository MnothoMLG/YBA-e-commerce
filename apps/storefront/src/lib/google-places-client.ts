"use client"

export type SelectedGooglePlace = {
  id?: string
  displayName?: string
  formattedAddress?: string
  addressComponents?: Array<{
    longText?: string
    shortText?: string
    types: string[]
  }>
  location?: { lat: () => number; lng: () => number }
  fetchFields: (request: { fields: string[] }) => Promise<void>
}

export type PlacesLibrary = {
  PlaceAutocompleteElement: new (options: {
    includedRegionCodes?: string[]
    requestedRegion?: string
  }) => HTMLElement
  Place: {
    searchByText: (request: {
      textQuery: string
      fields: string[]
      locationBias: { center: { lat: number; lng: number }; radius: number }
      maxResultCount: number
      region: string
    }) => Promise<{ places: SelectedGooglePlace[] }>
  }
}

type GoogleMapsWindow = typeof window & {
  google?: { maps: { importLibrary: (name: string) => Promise<PlacesLibrary> } }
}

const SCRIPT_ID = "google-maps-places-script"
const CALLBACK = "__ybaGoogleMapsReady"
let placesPromise: Promise<PlacesLibrary> | null = null

export function loadPlacesLibrary() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey)
    return Promise.reject(new Error("Google address search is not configured."))
  if (placesPromise) return placesPromise

  placesPromise = new Promise((resolve, reject) => {
    const googleWindow = window as GoogleMapsWindow
    const callbackWindow = window as typeof window & Record<string, unknown>
    const fail = (message: string) => {
      placesPromise = null
      delete callbackWindow[CALLBACK]
      reject(new Error(message))
    }
    const load = async () => {
      try {
        if (!googleWindow.google?.maps?.importLibrary) {
          return fail("Google Maps did not load correctly.")
        }
        const library = await googleWindow.google.maps.importLibrary("places")
        delete callbackWindow[CALLBACK]
        resolve(library)
      } catch (e) {
        fail(e instanceof Error ? e.message : "Google Places could not load.")
      }
    }

    if (googleWindow.google?.maps?.importLibrary) return void load()
    document.getElementById(SCRIPT_ID)?.remove()
    callbackWindow[CALLBACK] = load
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&loading=async&v=weekly&region=ZA&language=en&callback=${CALLBACK}`
    script.async = true
    script.onerror = () => fail("Google Maps could not be loaded.")
    document.head.appendChild(script)
  })
  return placesPromise
}

export async function findNearbyPepStores(origin: {
  lat: number
  lng: number
}) {
  const library = await loadPlacesLibrary()
  const { places } = await library.Place.searchByText({
    textQuery: "PEP store",
    fields: ["id", "displayName", "formattedAddress", "location"],
    locationBias: { center: origin, radius: 30000 },
    maxResultCount: 20,
    region: "za",
  })

  return places
    .flatMap((place) => {
      if (!place.id || !place.location || !/pep/i.test(place.displayName ?? ""))
        return []
      const location = { lat: place.location.lat(), lng: place.location.lng() }
      const distance = haversineKm(origin, location)
      return distance <= 30
        ? [
            {
              name: place.displayName ?? "PEP",
              address: place.formattedAddress ?? "",
              place_id: place.id,
              location,
              distance_km: Math.round(distance * 10) / 10,
            },
          ]
        : []
    })
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 15)
}

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}
