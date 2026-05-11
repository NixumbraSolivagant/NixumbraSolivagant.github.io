/**
 * Umami visitor data fetcher.
 *
 * Supports both self-hosted and Umami Cloud.
 *
 * Setup:
 *  - Self-hosted: set VITE_UMAMI_BASE to your server URL
 *  - Umami Cloud: set VITE_UMAMI_BASE to https://api.umami.is/v1
 *
 * Find your website UUID from the Umami dashboard (Websites → click your site).
 * Generate an API key in Settings → API Keys.
 */

const UMAMI_BASE = import.meta.env.VITE_UMAMI_BASE || ''
const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID || ''
const API_KEY = import.meta.env.VITE_UMAMI_API_KEY || ''

const API_BASE = UMAMI_BASE
const ENDPOINT = `${API_BASE}/websites/${WEBSITE_ID}/metrics`

/**
 * Fetch country visitor stats from the Umami metrics API.
 *
 * @param {number} [limit=10] - max number of countries to return
 * @returns {Promise<Array<{x: string, y: number}>>} country code → visitor count
 */
export async function fetchCountryStats(limit = 10) {
  if (!API_KEY || !WEBSITE_ID) {
    console.warn('[Umami] VITE_UMAMI_API_KEY or VITE_UMAMI_WEBSITE_ID not set — using mock data')
    return getMockData()
  }

  const params = new URLSearchParams({
    startAt: '0',
    endAt: Date.now().toString(),
    type: 'country',
    limit: limit.toString(),
  })

  const res = await fetch(`${ENDPOINT}?${params}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    console.warn(`[Umami] fetch failed (${res.status}), falling back to mock`)
    return getMockData()
  }

  const data = await res.json()
  return data.slice(0, limit)
}

/**
 * Fetch top countries with visitor counts, sorted descending.
 *
 * @param {number} [limit=10]
 * @returns {Promise<Array<{x: string, y: number}>>}
 */
export async function fetchTopCountries(limit = 10) {
  const stats = await fetchCountryStats(limit)
  return stats.sort((a, b) => b.y - a.y)
}

/**
 * Mock data for development / when Umami is not configured.
 * Simulates visits from 6 countries spread across continents.
 */
function getMockData() {
  return [
    { x: 'CN', y: 412 },
    { x: 'US', y: 287 },
    { x: 'JP', y: 156 },
    { x: 'DE', y: 98 },
    { x: 'BR', y: 73 },
    { x: 'IN', y: 54 },
    { x: 'AU', y: 41 },
    { x: 'FR', y: 38 },
    { x: 'RU', y: 29 },
    { x: 'GB', y: 24 },
  ]
}
