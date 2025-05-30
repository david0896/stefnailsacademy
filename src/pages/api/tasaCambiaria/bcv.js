function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default async function handler(req, res) {
  try {
    const url = `https://pydolarve.org/api/v1/dollar?page=bcv&monitor=usd`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`bcv API error: ${response.statusText}`);
    }

    const data = await response.json();

    console.log('data tasa de cambio:', data);

     if (!data || isObjectEmpty(data)) {
      return res.status(200).json({ mensaje: 'No hay datos después de los encabezados para tasa de cambio', datos: data.values || [] });
    }

    const tasaBcv = data.price;

    res.status(200).json(tasaBcv);

  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener tasa de cambio',
      detalles: error.message
    });
  }
}
