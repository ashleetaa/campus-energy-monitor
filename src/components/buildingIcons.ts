// An icon for each building, so they're easy to tell apart at a glance.
// Used on the dashboard cards and the detail screen header.

import { BedDouble, BookOpen, Dumbbell, FlaskConical, type LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  zachry: FlaskConical,
  'evans-library': BookOpen,
  'rec-center': Dumbbell,
  hullabaloo: BedDouble,
}

export function iconFor(buildingId: string): LucideIcon {
  return ICONS[buildingId] ?? FlaskConical
}
