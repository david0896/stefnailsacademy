/**
 * exchangeRateService — Servicio de tasa de cambio BCV
 * Refactorización de las APIs /api/tasaCambiaria/* para la arquitectura limpia
 */

const BCV_API_URL = 'https://api.dolarvzla.com/public/exchange-rate';

export const getEuroRate = async () => {
  const response = await fetch(BCV_API_URL);

  if (!response.ok) {
    throw new Error(`BCV API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rate = data?.current?.eur;

  if (!rate) {
    throw new Error('Tasa EUR no disponible en la respuesta de BCV');
  }

  return rate;
};

export const getUsdRate = async () => {
  const response = await fetch(BCV_API_URL);

  if (!response.ok) {
    throw new Error(`BCV API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rate = data?.current?.usd;

  if (!rate) {
    throw new Error('Tasa USD no disponible en la respuesta de BCV');
  }

  return rate;
};

/**
 * Convierte un precio en EUR a Bs usando la tasa BCV del día
 * @param {number} priceEUR
 * @returns {{ priceBs: number, priceEUR: number, rate: number }}
 */
export const convertEURtoBs = async (priceEUR) => {
  const rate = await getEuroRate();
  const priceBs = Number((priceEUR * rate).toFixed(2));
  return { priceBs, priceEUR, rate };
};
