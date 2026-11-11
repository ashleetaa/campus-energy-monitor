// The 4 campus buildings and how each one normally uses power over a day.

export type Building = {
  id: string
  name: string
  description: string
  peakKw: number // highest normal power draw, in kilowatts
  // 24 numbers, one per hour (index 0 = midnight, 13 = 1pm).
  // Each is a fraction of peakKw: 1.0 = full peak, 0.3 = 30% of peak.
  dailyPattern: number[]
}

export const BUILDINGS: Building[] = [
  {
    id: 'zachary',
    name: 'Zachary Engineering Education Complex',
    description: 'Labs and classrooms, busiest 9am–5pm',
    peakKw: 450,
    dailyPattern: [
      0.35, 0.33, 0.32, 0.32, 0.33, 0.38, 0.5, 0.7, 0.88, 0.97, 1.0, 1.0,
      0.98, 1.0, 0.99, 0.95, 0.88, 0.75, 0.6, 0.52, 0.47, 0.42, 0.38, 0.36,
    ],
  },
  {
    id: 'evans-library',
    name: 'Sterling C. Evans Library',
    description: 'Main library, open late, busiest in the evening',
    peakKw: 220,
    dailyPattern: [
      0.35, 0.32, 0.3, 0.3, 0.3, 0.32, 0.4, 0.55, 0.75, 0.88, 0.92, 0.95,
      0.97, 0.98, 0.98, 0.97, 0.95, 0.95, 0.97, 1.0, 0.98, 0.9, 0.7, 0.45,
    ],
  },
  {
    id: 'rec-center',
    name: 'Student Recreation Center',
    description: 'Gym and pool, busy early morning and evening',
    peakKw: 300,
    dailyPattern: [
      0.3, 0.28, 0.28, 0.28, 0.3, 0.55, 0.85, 0.9, 0.75, 0.65, 0.62, 0.65,
      0.7, 0.65, 0.62, 0.7, 0.88, 0.98, 1.0, 0.95, 0.85, 0.65, 0.45, 0.35,
    ],
  },
  {
    id: 'hullabaloo',
    name: 'Hullabaloo Hall',
    description: 'Residence hall, busiest in the evening',
    peakKw: 180,
    dailyPattern: [
      0.55, 0.5, 0.48, 0.47, 0.47, 0.5, 0.62, 0.75, 0.7, 0.55, 0.48, 0.47,
      0.48, 0.48, 0.5, 0.55, 0.65, 0.8, 0.92, 0.98, 1.0, 0.97, 0.85, 0.7,
    ],
  },
]
