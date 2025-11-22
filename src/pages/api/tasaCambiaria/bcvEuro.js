import isObjectEmpty from '@/utils/isObjectEmpty.js';

export default async function handler(req, res) {
  try {
    const url = `https://api.dolarvzla.com/public/exchange-rate`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`bcv API error: ${response.statusText}`);
    }

    const data = await response.json();

    console.log('data tasas de cambio:', data);

    if (isObjectEmpty(data)) {
      return res.status(500).json({ mensaje: 'No hay datos disponibles para tasa de cambio', datos: [] });
    }

    const oficialEuro = data?.current?.eur

    res.status(200).json(oficialEuro);

  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener tasa de cambio',
      detalles: error.message
    });
  }
}
