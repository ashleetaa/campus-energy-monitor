// Small 3D-style drawings of the 4 buildings for the campus map, made from
// plain SVG shapes (no images). Loosely based on the real Texas A&M buildings:
//   Zachry: renovated 5-story complex with big glass sections
//   Evans Library: tan brick with vertical concrete fins, plus a glass annex
//   Rec Center: big brick hall with maroon trim and a glass entrance
//   Hullabaloo Hall: 5-story brick dorm with stone trim, glass corner, archway
// Decoration only; hidden on phones.
//
// How it works: each building is a list of "parts" (boxes). Every point is
// given in 3D: a = distance to the left-back, b = distance to the right-back,
// z = height. toScreen() turns that into a 2D point with the usual isometric
// slant (each step back moves up by half a step).

import type { ReactNode } from 'react'

type Point = [number, number]

function toScreen(a: number, b: number, z: number): Point {
  return [b - a, -(a + b) / 2 - z]
}

// What a wall looks like.
type WallStyle =
  | 'windows' // rows of white-framed windows, one row per floor
  | 'glass' // a glass curtain wall
  | 'fins' // tall narrow windows between concrete fins
  | 'strip' // one long band of windows high up (for a gym)
  | 'plain' // no windows

type Colors = {
  leftWall: string
  rightWall: string // darker, so the building looks lit from the left
  roof: string
  glass: string
  trim?: string // a band along the top and bottom (stone, or Aggie maroon)
}

type Part = {
  a: number // front corner position (nearest the viewer)
  b: number
  z?: number // starts this high up (for things on a roof)
  width: number // along a (the left wall)
  depth: number // along b (the right wall)
  height: number
  floors: number
  leftStyle: WallStyle
  rightStyle: WallStyle
  entrance?: 'door' | 'arch' // in the middle of the left wall
  colors: Colors
}

const STONE: Colors = { leftWall: '#efe9dd', rightWall: '#d9d0bf', roof: '#cfd6df', glass: '#7fb3ef' }
const GLASS: Colors = { leftWall: '#dbeafe', rightWall: '#bfdbfe', roof: '#cfd6df', glass: '#6aa6ea' }
const CAMPUS_BRICK: Colors = { leftWall: '#dcb894', rightWall: '#c59f7a', roof: '#d6d3d1', glass: '#8dbcf0', trim: '#efe6d3' }
const REC_BRICK: Colors = { leftWall: '#dcb894', rightWall: '#c59f7a', roof: '#d6d3d1', glass: '#7fb3ef', trim: '#7b2c3a' }
const LIBRARY_BRICK: Colors = { leftWall: '#d8b48c', rightWall: '#bf9a72', roof: '#d6d3d1', glass: '#4f6f94', trim: '#ece4d4' }
const ROOF_UNIT: Colors = { leftWall: '#cbd5e1', rightWall: '#94a3b8', roof: '#e2e8f0', glass: '#94a3b8' }

const polygon = (points: Point[]) => points.map((p) => p.join(',')).join(' ')

// What goes on a wall. The wall is drawn flat (length × height), then slanted.
function WallDetails({ style, length, height, floors, entrance, colors }: { style: WallStyle; length: number; height: number; floors: number; entrance?: Part['entrance']; colors: Colors }) {
  const shapes: ReactNode[] = []
  const floorHeight = height / Math.max(floors, 1)

  if (style === 'windows') {
    const columns = Math.max(2, Math.round(length / 11))
    const columnWidth = length / columns
    for (let floor = 0; floor < floors; floor++) {
      for (let column = 0; column < columns; column++) {
        const x = column * columnWidth + columnWidth * 0.2
        const y = floor * floorHeight + floorHeight * 0.22
        const w = columnWidth * 0.6
        const h = floorHeight * 0.56
        shapes.push(<rect key={`f${floor}-${column}`} x={x - 0.8} y={y - 0.8} width={w + 1.6} height={h + 1.6} fill="#ffffff" opacity={0.9} />)
        shapes.push(<rect key={`g${floor}-${column}`} x={x} y={y} width={w} height={h} fill={colors.glass} />)
      }
    }
  }

  if (style === 'glass') {
    shapes.push(<rect key="glass" x={1.5} y={1.5} width={length - 3} height={height - 3} fill={colors.glass} />)
    for (let x = 7; x < length - 2; x += 7) {
      shapes.push(<line key={`v${x}`} x1={x} y1={1.5} x2={x} y2={height - 1.5} stroke="#ffffff" strokeWidth={0.7} opacity={0.8} />)
    }
    for (let floor = 1; floor < floors; floor++) {
      shapes.push(<line key={`h${floor}`} x1={1.5} y1={floor * floorHeight} x2={length - 1.5} y2={floor * floorHeight} stroke="#ffffff" strokeWidth={1.1} />)
    }
  }

  if (style === 'fins') {
    // Tall dark windows with light concrete fins between them.
    for (let x = 3; x < length - 5; x += 7) {
      shapes.push(<rect key={`w${x}`} x={x} y={5} width={4} height={height - 12} fill={colors.glass} />)
      shapes.push(<rect key={`f${x}`} x={x + 4} y={3} width={3} height={height - 8} fill="#f1ece2" />)
    }
  }

  if (style === 'strip') {
    shapes.push(<rect key="strip" x={4} y={height * 0.18} width={length - 8} height={height * 0.2} fill={colors.glass} />)
    for (let x = 12; x < length - 6; x += 9) {
      shapes.push(<line key={`m${x}`} x1={x} y1={height * 0.18} x2={x} y2={height * 0.38} stroke="#ffffff" strokeWidth={0.8} />)
    }
  }

  // Bands along the top and bottom: cast stone on brick, or Aggie maroon.
  if (colors.trim) {
    shapes.push(<rect key="top" x={0} y={0} width={length} height={3.5} fill={colors.trim} />)
    shapes.push(<rect key="bottom" x={0} y={height - 5} width={length} height={5} fill={colors.trim} />)
  }

  if (entrance === 'door') {
    shapes.push(<rect key="door" x={length / 2 - 6} y={height - floorHeight * 0.8} width={12} height={floorHeight * 0.8} fill="#334155" />)
  }
  if (entrance === 'arch') {
    // A two-story archway through the building.
    const half = 9
    const top = height - floorHeight * 1.7
    shapes.push(
      <path
        key="arch"
        d={`M ${length / 2 - half} ${height} V ${top + half} A ${half} ${half} 0 0 1 ${length / 2 + half} ${top + half} V ${height} Z`}
        fill="#5b4636"
        stroke={colors.trim ?? '#ffffff'}
        strokeWidth={2}
      />,
    )
  }

  // A soft darker strip along the very bottom of every wall.
  shapes.push(<rect key="base" x={0} y={height - 2} width={length} height={2} fill="#000000" opacity={0.08} />)
  return <>{shapes}</>
}

// One part: left wall, right wall, then a flat roof with a raised rim.
// The walls are drawn flat and slanted into place with an SVG "matrix"
// (0.5 / -0.5 is the isometric slope).
function PartShape({ part }: { part: Part }) {
  const { a, b, width: w, depth: d, height: h, colors } = part
  const z = part.z ?? 0
  const [lx, ly] = toScreen(a + w, b, z + h) // top of the left wall's far end
  const [rx, ry] = toScreen(a, b, z + h) // top of the front corner
  const top = (da: number, db: number) => toScreen(a + da, b + db, z + h)
  const rim = Math.min(3, w / 6, d / 6)
  return (
    <g>
      <g transform={`matrix(1, 0.5, 0, 1, ${lx}, ${ly})`}>
        <rect width={w} height={h} fill={colors.leftWall} stroke="#94a3b8" strokeWidth={0.6} />
        <WallDetails style={part.leftStyle} length={w} height={h} floors={part.floors} entrance={part.entrance} colors={colors} />
      </g>
      <g transform={`matrix(1, -0.5, 0, 1, ${rx}, ${ry})`}>
        <rect width={d} height={h} fill={colors.rightWall} stroke="#94a3b8" strokeWidth={0.6} />
        <WallDetails style={part.rightStyle} length={d} height={h} floors={part.floors} colors={colors} />
      </g>
      <g stroke="#94a3b8" strokeWidth={0.6} strokeLinejoin="round">
        <polygon points={polygon([top(0, 0), top(w, 0), top(w, d), top(0, d)])} fill={colors.roof} />
        <polygon points={polygon([top(rim, rim), top(w - rim, rim), top(w - rim, d - rim), top(rim, d - rim)])} fill="#000000" fillOpacity={0.06} strokeWidth={0.3} />
      </g>
    </g>
  )
}

// Each building's parts, listed back to front (so nearer parts cover farther ones).
const BUILDINGS: Record<string, Part[]> = {
  zachry: [
    // long 5-story hall with framed windows
    { a: 0, b: 0, width: 132, depth: 46, height: 52, floors: 5, leftStyle: 'windows', rightStyle: 'glass', colors: STONE },
    // HVAC units on the roof
    { a: 18, b: 14, z: 52, width: 16, depth: 12, height: 6, floors: 1, leftStyle: 'plain', rightStyle: 'plain', colors: ROOF_UNIT },
    { a: 98, b: 14, z: 52, width: 16, depth: 12, height: 6, floors: 1, leftStyle: 'plain', rightStyle: 'plain', colors: ROOF_UNIT },
    // tall glass entrance hall in the middle
    { a: 50, b: -12, width: 32, depth: 12, height: 58, floors: 5, leftStyle: 'glass', rightStyle: 'glass', entrance: 'door', colors: GLASS },
  ],
  'evans-library': [
    // newer glass annex behind
    { a: 72, b: 6, width: 56, depth: 40, height: 34, floors: 3, leftStyle: 'glass', rightStyle: 'glass', colors: GLASS },
    // main library: tan brick with vertical fins
    { a: 0, b: 0, width: 72, depth: 58, height: 70, floors: 6, leftStyle: 'fins', rightStyle: 'fins', entrance: 'door', colors: LIBRARY_BRICK },
  ],
  'rec-center': [
    // big gym hall: brick, a high band of windows, maroon trim
    { a: 0, b: 0, width: 134, depth: 66, height: 40, floors: 2, leftStyle: 'strip', rightStyle: 'strip', colors: REC_BRICK },
    // glass entrance lobby in front
    { a: 48, b: -14, width: 38, depth: 14, height: 26, floors: 2, leftStyle: 'glass', rightStyle: 'glass', entrance: 'door', colors: GLASS },
  ],
  hullabaloo: [
    // back wing of the L
    { a: 0, b: 36, width: 36, depth: 66, height: 54, floors: 5, leftStyle: 'windows', rightStyle: 'windows', colors: CAMPUS_BRICK },
    // front wing with the archway
    { a: 0, b: 0, width: 120, depth: 36, height: 54, floors: 5, leftStyle: 'windows', rightStyle: 'windows', entrance: 'arch', colors: CAMPUS_BRICK },
    // glass corner tower
    { a: -6, b: -6, width: 16, depth: 16, height: 60, floors: 5, leftStyle: 'glass', rightStyle: 'glass', colors: GLASS },
  ],
}

// Every corner of every part, to size the picture to fit.
function allCorners(parts: Part[]): Point[] {
  return parts.flatMap((p) => {
    const corners: Point[] = []
    for (const da of [0, p.width]) {
      for (const db of [0, p.depth]) {
        corners.push(toScreen(p.a + da, p.b + db, p.z ?? 0), toScreen(p.a + da, p.b + db, (p.z ?? 0) + p.height))
      }
    }
    return corners
  })
}

function BuildingArt({ buildingId }: { buildingId: string }) {
  const parts = BUILDINGS[buildingId]
  if (!parts) return null

  // Fit the picture around the building, with a little room for shrubs.
  const corners = allCorners(parts)
  const minX = Math.min(...corners.map((c) => c[0])) - 10
  const maxX = Math.max(...corners.map((c) => c[0])) + 10
  const minY = Math.min(...corners.map((c) => c[1])) - 4
  const maxY = Math.max(...corners.map((c) => c[1])) + 8

  // Shrubs in front of the biggest part's two front walls.
  const main = parts.reduce((big, p) => (p.width * p.depth > big.width * big.depth ? p : big))
  const shrubs: Point[] = [
    toScreen(main.a + main.width * 0.2, main.b - 7, 0),
    toScreen(main.a + main.width * 0.85, main.b - 7, 0),
    toScreen(main.a - 7, main.b + main.depth * 0.6, 0),
  ]

  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="w-full" aria-hidden="true">
      {/* soft shadow on the ground */}
      <ellipse cx={(minX + maxX) / 2} cy={maxY - 10} rx={(maxX - minX) / 2.1} ry={10} fill="#15803d" opacity={0.1} />
      {parts.map((part, i) => (
        <PartShape key={i} part={part} />
      ))}
      {shrubs.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x - 4} cy={y} r={5} fill="#4d8a5a" />
          <circle cx={x + 3} cy={y - 1} r={6} fill="#5c9468" />
        </g>
      ))}
    </svg>
  )
}

// One spot on the map: the building drawing with its card on top, overlapping
// the bottom of the drawing. `mirror` flips the drawing so buildings in the
// left column face right, toward the middle of the map. On phones only the
// card shows.
export function MapSpot({ buildingId, mirror, children }: { buildingId: string; mirror: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className={`pointer-events-none mx-auto -mb-10 hidden w-full max-w-72 sm:block ${mirror ? '-scale-x-100' : ''}`}>
        <BuildingArt buildingId={buildingId} />
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
