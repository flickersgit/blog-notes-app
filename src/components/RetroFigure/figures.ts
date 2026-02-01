// Figure metadata and definitions for retro pixel art characters

export type AnimationType = 'idle' | 'walk' | 'bounce' | 'wave'

export interface FigureDefinition {
  id: string
  name: string
  category: 'minecraft' | 'lego'
  description: string
}

export const FIGURES: FigureDefinition[] = [
  // Minecraft-style characters
  { id: 'steve', name: 'Steve', category: 'minecraft', description: 'Classic Minecraft player' },
  { id: 'alex', name: 'Alex', category: 'minecraft', description: 'Minecraft player with orange hair' },
  { id: 'creeper', name: 'Creeper', category: 'minecraft', description: 'Explosive green mob' },
  { id: 'skeleton', name: 'Skeleton', category: 'minecraft', description: 'Bony archer mob' },
  { id: 'zombie', name: 'Zombie', category: 'minecraft', description: 'Undead mob' },
  // Lego-style minifigs
  { id: 'lego-red', name: 'Red Minifig', category: 'lego', description: 'Classic red Lego figure' },
  { id: 'lego-blue', name: 'Blue Minifig', category: 'lego', description: 'Classic blue Lego figure' },
  { id: 'lego-yellow', name: 'Yellow Minifig', category: 'lego', description: 'Classic yellow Lego figure' },
  { id: 'lego-green', name: 'Green Minifig', category: 'lego', description: 'Classic green Lego figure' },
]

export const ANIMATIONS: { id: AnimationType; name: string; description: string }[] = [
  { id: 'idle', name: 'Idle', description: 'Subtle breathing motion' },
  { id: 'walk', name: 'Walk', description: 'Stepping in place' },
  { id: 'bounce', name: 'Bounce', description: 'Jumping up and down' },
  { id: 'wave', name: 'Wave', description: 'Waving arm' },
]

export function getFigureById(id: string): FigureDefinition | undefined {
  return FIGURES.find(f => f.id === id)
}
