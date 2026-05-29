/**
 * bcvRate — consulta la tasa BCV vigente desde la API de dolarvzla.
 *
 * Diseñado para ser NON-BLOCKING: si la API está caída, lenta o devuelve
 * algo raro, retorna null en vez de lanzar. El caller (createEnrollment)
 * persiste null cuando no pudo capturar la tasa — la inscripción NO debe
 * romperse por un fallo de un servicio externo de tasa.
 *
 * Cache: ninguno aquí. Cada inscripción consulta en vivo porque queremos
 * la tasa exacta del momento del pago como snapshot histórico.
 */

const UPSTREAM = 'https://api.dolarvzla.com/public/exchange-rate';
const TIMEOUT_MS = 5000;

/**
 * Devuelve la tasa BCV EUR vigente (Bs por 1 EUR) o null si no se pudo.
 * @returns {Promise<number|null>}
 */
export async function getCurrentBcvEurRate() {
  try {
    const r = await fetch(UPSTREAM, {
      // Evita colgar el use case si dolarvzla anda lento
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!r.ok) {
      console.warn('[bcvRate] dolarvzla respondió', r.status, r.statusText);
      return null;
    }
    const data = await r.json();
    const rate = data?.current?.eur;
    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
      console.warn('[bcvRate] respuesta inesperada:', JSON.stringify(data)?.slice(0, 200));
      return null;
    }
    return rate;
  } catch (err) {
    console.error('[bcvRate] error consultando tasa BCV EUR:', err?.message || String(err));
    return null;
  }
}
