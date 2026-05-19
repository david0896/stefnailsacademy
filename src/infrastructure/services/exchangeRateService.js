/**
 * exchangeRateService — Tasa de cambio EUR/Bs y USD/Bs
 *
 * Estrategia de fallback en 2 capas:
 *   1. API externa: exchangerate-api.com (gratuita, sin auth)
 *   2. Tasa manual almacenada en Content table (clave: tasa.eur.bcv / tasa.usd.bcv)
 *      El admin la actualiza desde /backoffice/contenido cuando la API falla.
 */

import prisma from '@/lib/prisma';

const EXCHANGE_API_EUR = 'https://api.exchangerate-api.com/v4/latest/EUR';
const EXCHANGE_API_USD = 'https://api.exchangerate-api.com/v4/latest/USD';

// ─── EUR/Bs ───────────────────────────────────────────────────────────────
export const getEuroRate = async () => {
  try {
    const res = await fetch(EXCHANGE_API_EUR);
    if (!res.ok) throw new Error(`exchangerate-api EUR error: ${res.status}`);
    const data = await res.json();
    const rate = data?.rates?.VES;
    if (!rate) throw new Error('VES no disponible en respuesta EUR');
    return Number(rate);
  } catch (externalErr) {
    console.warn('[exchangeRateService] API externa EUR falló, usando tasa manual:', externalErr.message);
    return getFallbackRate('tasa.eur.bcv', 60);
  }
};

// ─── USD/Bs ───────────────────────────────────────────────────────────────
export const getUsdRate = async () => {
  try {
    const res = await fetch(EXCHANGE_API_USD);
    if (!res.ok) throw new Error(`exchangerate-api USD error: ${res.status}`);
    const data = await res.json();
    const rate = data?.rates?.VES;
    if (!rate) throw new Error('VES no disponible en respuesta USD');
    return Number(rate);
  } catch (externalErr) {
    console.warn('[exchangeRateService] API externa USD falló, usando tasa manual:', externalErr.message);
    return getFallbackRate('tasa.usd.bcv', 55);
  }
};

// ─── Fallback desde Content table ────────────────────────────────────────
async function getFallbackRate(key, minSafe) {
  try {
    const record = await prisma.content.findUnique({ where: { key } });
    if (record?.value) {
      const rate = Number(record.value);
      if (!isNaN(rate) && rate > 0) return rate;
    }
  } catch (dbErr) {
    console.error('[exchangeRateService] Fallback DB también falló:', dbErr.message);
  }
  console.warn(`[exchangeRateService] Usando tasa mínima de seguridad: ${minSafe}`);
  return minSafe;
}

// ─── Conversión EUR → Bs ─────────────────────────────────────────────────
export const convertEURtoBs = async (priceEUR) => {
  const rate = await getEuroRate();
  const priceBs = Number((priceEUR * rate).toFixed(2));
  return { priceBs, priceEUR, rate };
};
