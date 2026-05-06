/**
 * Umami visitor data fetcher.
 *
 * Since Umami is a self-hosted analytics platform, this module fetches
 * country stats via the Umami public share API — no login required.
 *
 * Setup: In your Umami dashboard, create a "Share" link for your website
 * (Website Settings → Share). Paste the share URL here.
 *
 * Example share URL:
 *   https://umami.example.com/share/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/your-website-slug
 *                                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                                            replace SHARE_ID and SLUG below
 */

// ── Configuration ────────────────────────────────────────────────────────────
const UMAMI_BASE = import.meta.env.VITE_UMAMI_BASE || ''
const SHARE_ID = import.meta.env.VITE_UMAMI_SHARE_ID || ''
const SLUG = import.meta.env.VITE_UMAMI_SLUG || ''

const API_BASE = UMAMI_BASE
  ? `${UMAMI_BASE}/api/share`
  : '/api/share'

/**
 * Fetch country visitor stats from the Umami public share endpoint.
 *
 * @param {string} [websiteSlug] - optional override
 * @returns {Promise<Array<{x: string, y: number}>>} country code → visitor count
 */
export async function fetchCountryStats(websiteSlug = SLUG) {
  if (!SHARE_ID) {
    console.warn('[Umami] VITE_UMAMI_SHARE_ID not set — using mock data')
    return getMockData()
  }

  const url = `${API_BASE}/${SHARE_ID}${websiteSlug ? `/${websiteSlug}` : ''}/metrics`

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'countries',
      startAt: 0,
      endAt: Date.now(),
    }),
    method: 'POST',
  })

  if (!res.ok) {
    console.warn(`[Umami] fetch failed (${res.status}), falling back to mock`)
    return getMockData()
  }

  const json = await res.json()
  return json.data || []
}

/**
 * Fetch top countries with visitor counts.
 * Convenience wrapper that returns sorted results.
 *
 * @param {number} [limit=10]
 * @returns {Promise<Array<{x: string, y: number}>>}
 */
export async function fetchTopCountries(limit = 10) {
  const stats = await fetchCountryStats()
  return stats
    .sort((a, b) => b.y - a.y)
    .slice(0, limit)
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
