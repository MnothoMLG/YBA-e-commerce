import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/pep-stores
 *
 * Finds PEP stores near a shipping address using the Google Maps APIs, so a
 * customer choosing "PAXI via PEP" can pick a nearby store for pickup.
 *
 * Query params (one location source required):
 *   - address: free-text address to geocode, OR
 *   - lat & lng: explicit coordinates
 *   - radius: search radius in km (default 30, max 50)
 *
 * Requires GOOGLE_MAPS_API_KEY (Geocoding API + Places API enabled).
 */

type LatLng = { lat: number; lng: number }

type PepStore = {
  name: string
  address: string
  place_id: string
  location: LatLng
  distance_km: number
}

const EARTH_RADIUS_KM = 6371

function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      message:
        "PEP store finder is not configured. Set GOOGLE_MAPS_API_KEY in the backend environment.",
    })
  }

  const q = req.query as Record<string, string | undefined>
  const address = q.address?.trim()
  const latParam = q.lat ? Number(q.lat) : undefined
  const lngParam = q.lng ? Number(q.lng) : undefined
  const radiusKm = Math.min(Number(q.radius) || 30, 50)
  const radiusM = Math.round(radiusKm * 1000)

  try {
    // 1) Resolve an origin coordinate
    let origin: LatLng | undefined
    let formattedAddress: string | undefined

    if (
      typeof latParam === "number" &&
      !Number.isNaN(latParam) &&
      typeof lngParam === "number" &&
      !Number.isNaN(lngParam)
    ) {
      origin = { lat: latParam, lng: lngParam }
    } else if (address) {
      // Prefer the Geocoding API; fall back to Places "Find Place" so the
      // finder still works when only the Places API is enabled.
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&region=za&key=${apiKey}`
      const geo = (await (await fetch(geoUrl)).json()) as any

      if (geo.status === "OK" && geo.results?.length) {
        origin = geo.results[0].geometry.location
        formattedAddress = geo.results[0].formatted_address
      } else {
        const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
          address
        )}&inputtype=textquery&fields=geometry,formatted_address&key=${apiKey}`
        const find = (await (await fetch(findUrl)).json()) as any
        const cand = find.candidates?.[0]
        if (cand?.geometry?.location) {
          origin = cand.geometry.location
          formattedAddress = cand.formatted_address
        } else {
          return res.status(400).json({
            message: `Could not locate that address (${geo.status}${
              find.status ? " / " + find.status : ""
            }).`,
            stores: [],
          })
        }
      }
    } else {
      return res.status(400).json({
        message: "Provide an 'address' or 'lat' & 'lng' query parameter.",
      })
    }

    // 2) Find nearby PEP stores via Places Nearby Search
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin!.lat},${origin!.lng}&radius=${radiusM}&keyword=${encodeURIComponent(
      "PEP store"
    )}&key=${apiKey}`
    const placesRes = await fetch(placesUrl)
    const places = (await placesRes.json()) as any

    if (places.status !== "OK" && places.status !== "ZERO_RESULTS") {
      return res.status(502).json({
        message: `Places lookup failed (${places.status}).`,
        stores: [],
      })
    }

    const stores: PepStore[] = (places.results ?? [])
      .filter((p: any) => /pep/i.test(p.name ?? ""))
      .map((p: any) => {
        const location: LatLng = p.geometry?.location
        return {
          name: p.name,
          address: p.vicinity ?? p.formatted_address ?? "",
          place_id: p.place_id,
          location,
          distance_km: Math.round(haversineKm(origin!, location) * 10) / 10,
        }
      })
      .filter((s: PepStore) => s.location && s.distance_km <= radiusKm)
      .sort((a: PepStore, b: PepStore) => a.distance_km - b.distance_km)
      .slice(0, 15)

    return res.json({
      origin,
      formatted_address: formattedAddress,
      radius_km: radiusKm,
      count: stores.length,
      stores,
    })
  } catch (e: any) {
    return res.status(500).json({
      message: `PEP store lookup error: ${e?.message ?? "unknown error"}`,
      stores: [],
    })
  }
}
