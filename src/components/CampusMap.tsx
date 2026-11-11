// The "Campus energy map" box on the dashboard: a simple drawing of a lawn,
// walking paths, trees, other campus buildings and a quad in the middle, with
// the 4 building cards placed on top (passed in as children). The drawing is
// decoration only, not the real campus layout. On phones it's hidden and only
// the cards show.

import type { ReactNode } from 'react'

// Tree positions as % of the map's width and height, plus a size in pixels.
// Placed along the edges and in the gaps between cards, where they can be seen.
const TREES = [
  // top corners
  { left: 4, top: 5, size: 36 },
  { left: 8, top: 3, size: 26 },
  { left: 92, top: 4, size: 28 },
  { left: 96, top: 6, size: 38 },
  // bottom corners
  { left: 4, top: 93, size: 34 },
  { left: 9, top: 96, size: 26 },
  { left: 91, top: 95, size: 26 },
  { left: 96, top: 92, size: 36 },
  // left and right edges
  { left: 3, top: 52, size: 32 },
  { left: 97, top: 48, size: 30 },
  // in the gaps around the quad
  { left: 47, top: 12, size: 34 },
  { left: 53, top: 8, size: 24 },
  { left: 46, top: 88, size: 26 },
  { left: 53, top: 92, size: 34 },
  { left: 22, top: 50, size: 24 },
  { left: 78, top: 50, size: 24 },
]

// Pale outlines of other campus buildings along the left and right edges.
const OTHER_BUILDINGS = [
  { left: 0, top: 14, width: 3.5, height: 22 },
  { left: 0, top: 66, width: 3.5, height: 18 },
  { left: 96.5, top: 16, width: 3.5, height: 20 },
  { left: 96.5, top: 64, width: 3.5, height: 22 },
]

// One tree: a round green top on a short brown trunk.
function Tree({ left, top, size }: { left: number; top: number; size: number }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%`, top: `${top}%`, width: size, height: size * 1.3 }}
    >
      <div className="absolute bottom-0 left-1/2 h-1/3 w-[3px] -translate-x-1/2 rounded-full bg-amber-800/60" />
      <div className="absolute inset-x-0 top-0 aspect-square rounded-full bg-green-400 shadow-sm" />
      {/* a lighter spot so the tree looks rounded */}
      <div className="absolute top-[10%] left-[18%] size-2/5 rounded-full bg-green-300" />
    </div>
  )
}

export default function CampusMap({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Campus energy map</h2>
      <p className="mb-4 text-sm text-slate-500">Current power use by building</p>

      <div className="relative overflow-hidden rounded-xl sm:bg-green-100/60">
        {/* The drawing. Hidden on phones. */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
          {/* Walking paths. viewBox is 100×100 and stretches to fit, so the
              numbers are % of the map; non-scaling-stroke keeps lines even. */}
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <g stroke="#ffffff" strokeOpacity="0.85" strokeWidth="18" strokeLinecap="round">
              <line x1="0" y1="50" x2="100" y2="50" vectorEffect="non-scaling-stroke" />
              <line x1="50" y1="0" x2="50" y2="100" vectorEffect="non-scaling-stroke" />
              <line x1="25" y1="0" x2="75" y2="100" vectorEffect="non-scaling-stroke" />
              <line x1="75" y1="0" x2="25" y2="100" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>

          {OTHER_BUILDINGS.map((b, i) => (
            <div
              key={i}
              className="absolute rounded-md border border-slate-200 bg-slate-50"
              style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` }}
            />
          ))}

          {/* The quad: a green square turned 45° where the paths meet. */}
          <div className="absolute top-1/2 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-2xl border-[6px] border-white/90 bg-green-200" />
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center leading-tight font-semibold text-green-800">
            Main
            <br />
            Quad
          </p>

          {TREES.map((tree, i) => (
            <Tree key={i} {...tree} />
          ))}
        </div>

        {/* The building cards, spaced apart so the lawn, paths and quad show around them. */}
        <div className="relative grid gap-4 sm:grid-cols-2 sm:gap-x-32 sm:gap-y-24 sm:px-14 sm:py-12">
          {children}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <span className="size-4 rounded border-2 border-red-400 bg-red-50" />
          Higher than expected
        </span>
        <span className="flex items-center gap-2">
          <span className="size-4 rounded border-2 border-green-300 bg-green-50" />
          Normal usage
        </span>
      </div>
    </section>
  )
}
