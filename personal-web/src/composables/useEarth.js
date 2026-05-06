/**
 * useEarth — composable that wires data fetching → EarthRenderer
 *
 * GlobeViewer.vue imports this and uses the EarthRenderer class directly.
 */

import { EarthRenderer } from './useEarthRenderer.js'
import { fetchTopCountries } from '@/modules/umamiClient.js'
import { statsToMarkers } from '@/modules/geoUtils.js'

// Origin: approximate user location (Jiangxi Nanchang)
const USER_ORIGIN = [28.0, 115.0]

export function useEarth(canvasRef, opts = {}) {
  let renderer = null
  let pollTimer = null
  let pollInterval = opts.refreshMs || 60_000

  function mount() {
    if (!canvasRef.value) return
    renderer = new EarthRenderer(canvasRef.value, {
      ...opts,
      onMarkerHover: opts.onMarkerHover || (() => {}),
      onMarkerLeave:  opts.onMarkerLeave  || (() => {}),
    })
  }

  async function refresh() {
    try {
      const countries = await fetchTopCountries(20)
      if (!countries.length) return

      const markers = statsToMarkers(countries)

      // Arcs from user origin to top countries
      const arcs = countries.slice(0, 8).map(c => ({
        from:   USER_ORIGIN,
        to:     c.x,
        color:  [0.38, 0.65, 1.0],
        height: 0.22,
        width:  0.006,
      }))

      if (renderer) {
        renderer.setMarkers(markers)
        renderer.setArcs(arcs)
      }
    } catch (e) {
      console.warn('[useEarth] refresh failed:', e)
    }
  }

  function startPolling() {
    stopPolling()
    if (pollInterval > 0) {
      pollTimer = setInterval(refresh, pollInterval)
    }
  }

  function stopPolling() {
    clearInterval(pollTimer)
    pollTimer = null
  }

  function destroy() {
    stopPolling()
    renderer && renderer.destroy()
    renderer = null
  }

  return { mount, refresh, destroy, startPolling, stopPolling }
}
