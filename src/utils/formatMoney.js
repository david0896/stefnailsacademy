/**
 * formatMoney — helpers de formato monetario consistentes en toda la app.
 *
 * Usa locale es-VE: separador decimal = coma, miles = punto.
 *   1234.5  → "1.234,50"
 *
 * Diseñado para reutilizarse desde el BO (detalle/listado) y desde los
 * correos al admin, manteniendo el mismo look & feel para los montos.
 */

const nfVE = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * "€5,00"  /  "—" si amount es null/undefined.
 * @param {number|null|undefined} amount
 */
export function formatEur(amount) {
  if (amount == null || !Number.isFinite(amount)) return '—';
  return `€${nfVE.format(amount)}`;
}

/**
 * "Bs 1.250,00" / "—" si amount es null/undefined.
 * @param {number|null|undefined} amount
 */
export function formatBs(amount) {
  if (amount == null || !Number.isFinite(amount)) return '—';
  return `Bs ${nfVE.format(amount)}`;
}

/**
 * "€1 = Bs 250,00" (sub-rótulo de la tasa BCV usada).
 * @param {number|null|undefined} rate
 */
export function formatBcvEurRate(rate) {
  if (rate == null || !Number.isFinite(rate)) return null;
  return `€1 = Bs ${nfVE.format(rate)}`;
}
