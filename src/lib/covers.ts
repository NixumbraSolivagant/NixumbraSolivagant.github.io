interface CoverPalette {
  from: string
  to: string
  tint: string
}

const PALETTES: Record<string, CoverPalette> = {
  violet: { from: '#7c3aed', to: '#22d3ee', tint: '#a78bfa' },
  cyan: { from: '#0891b2', to: '#6366f1', tint: '#67e8f9' },
  amber: { from: '#f59e0b', to: '#f472b6', tint: '#fcd34d' },
  pink: { from: '#db2777', to: '#8b5cf6', tint: '#f9a8d4' },
  emerald: { from: '#059669', to: '#22d3ee', tint: '#6ee7b7' },
}

export function coverPalette(name: string): CoverPalette {
  return PALETTES[name] ?? PALETTES.violet
}

export function coverStyle(name: string): Record<string, string> {
  const palette = coverPalette(name)
  return {
    background: `linear-gradient(135deg, ${palette.from}cc 0%, ${palette.to}55 55%, rgba(8,10,18,0.9) 100%)`,
  }
}
