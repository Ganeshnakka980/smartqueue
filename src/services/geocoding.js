/**
 * Geocoding Service for SmartQueue
 * Converts street addresses into latitude and longitude coordinates using OpenStreetMap Nominatim API.
 */

/**
 * Geocode a physical address string into { latitude, longitude }
 * @param {string} address 
 * @returns {Promise<{latitude: number, longitude: number}|null>}
 */
export async function geocodeAddress(address) {
  if (!address || typeof address !== 'string' || !address.trim()) {
    return null
  }

  const cleanAddr = address.trim()

  // Helper fetcher function
  const fetchCoords = async (queryStr) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}&limit=1`
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SmartQueueApp/1.0 (contact@smartqueue.com)'
        }
      })
      if (!res.ok) return null
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        if (!isNaN(lat) && !isNaN(lng)) {
          return { latitude: lat, longitude: lng }
        }
      }
      return null
    } catch (err) {
      console.warn('Geocoding fetch error:', err)
      return null
    }
  }

  // 1. Primary Attempt: Full address string
  let result = await fetchCoords(cleanAddr)
  if (result) return result

  // 2. Fallback Attempt 1: Remove room/suite/shop prefixes if present
  const simplified = cleanAddr
    .replace(/^(shop|flat|unit|office|suite|room|no\.?)\s*[\w\d-]+\s*,\s*/i, '')
    .trim()

  if (simplified && simplified !== cleanAddr) {
    result = await fetchCoords(simplified)
    if (result) return result
  }

  // 3. Fallback Attempt 2: Try last 2 or 3 comma-separated location parts (e.g. area, city, pincode)
  const parts = cleanAddr.split(',').map(p => p.trim()).filter(Boolean)
  if (parts.length > 2) {
    const broaderAddr = parts.slice(-3).join(', ')
    result = await fetchCoords(broaderAddr)
    if (result) return result
  } else if (parts.length > 1) {
    const cityAreaAddr = parts.slice(-2).join(', ')
    result = await fetchCoords(cityAreaAddr)
    if (result) return result
  }

  console.warn(`[Geocoding Service] Unable to resolve coordinates for address: "${address}"`)
  return null
}

/**
 * One-time migration helper function to auto-geocode all existing branches in Supabase
 * that have an address but are missing latitude/longitude coordinates.
 * @param {object} supabaseClient 
 * @returns {Promise<{success: boolean, total: number, updated: number, failed: number, error?: string}>}
 */
export async function geocodeExistingBranches(supabaseClient) {
  if (!supabaseClient) {
    return { success: false, total: 0, updated: 0, failed: 0, error: 'Supabase client instance required.' }
  }

  try {
    const { data: branches, error } = await supabaseClient
      .from('branches')
      .select('id, name, address, latitude, longitude')

    if (error) throw error
    if (!branches || branches.length === 0) {
      return { success: true, total: 0, updated: 0, failed: 0 }
    }

    // Filter branches missing lat/lng coordinates
    const ungeocoded = branches.filter(b => 
      b.address && 
      (b.latitude === null || b.longitude === null || b.latitude === undefined || b.longitude === undefined)
    )

    if (ungeocoded.length === 0) {
      return { success: true, total: 0, updated: 0, failed: 0 }
    }

    console.log(`[Geocoding Migration] Found ${ungeocoded.length} branches needing coordinates out of ${branches.length} total.`)

    let updatedCount = 0
    let failedCount = 0

    for (const b of ungeocoded) {
      console.log(`Geocoding branch: "${b.name}" -> ${b.address}`)
      const coords = await geocodeAddress(b.address)

      if (coords) {
        const { error: updateErr } = await supabaseClient
          .from('branches')
          .update({
            latitude: coords.latitude,
            longitude: coords.longitude
          })
          .eq('id', b.id)

        if (!updateErr) {
          updatedCount++
          console.log(`  ✅ Successfully updated "${b.name}" with [${coords.latitude}, ${coords.longitude}]`)
        } else {
          console.warn(`  ❌ DB update failed for "${b.name}":`, updateErr.message)
          failedCount++
        }
      } else {
        console.warn(`  ⚠️ Could not resolve coordinates for "${b.name}"`)
        failedCount++
      }

      // Pause 1 second between requests to respect Nominatim API rate limits
      await new Promise(res => setTimeout(res, 1000))
    }

    return {
      success: true,
      total: ungeocoded.length,
      updated: updatedCount,
      failed: failedCount
    }
  } catch (err) {
    console.error('[Geocoding Migration Error]:', err)
    return { success: false, total: 0, updated: 0, failed: 0, error: err.message }
  }
}
