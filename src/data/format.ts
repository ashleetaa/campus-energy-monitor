// Turns raw numbers into labels people can read: "1,234 kWh", "$148".

export function formatKw(kw: number): string {
  return `${Math.round(kw).toLocaleString('en-US')} kW`
}

export function formatKwh(kwh: number): string {
  return `${Math.round(kwh).toLocaleString('en-US')} kWh`
}

export function formatDollars(dollars: number): string {
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}
