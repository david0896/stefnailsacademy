/* function isObjectEmpty(obj) {
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
 */

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default async function handler(req, res) {
  try {
    const url = `https://ve.dolarapi.com/v1/dolares`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`bcv API error: ${response.statusText}`);
    }

    const data = await response.json();

    console.log('data tasa de cambio:', data);

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(200).json({ mensaje: 'No hay datos disponibles para tasa de cambio', datos: [] });
    }

    // Buscar el objeto con fuente === "oficial"
    const oficial = data.find(item => item.fuente === 'oficial');

    if (!oficial || typeof oficial.promedio !== 'number') {
      return res.status(200).json({ mensaje: 'No se encontró tasa oficial válida', datos: oficial || {} });
    }

    const tasaBcv = oficial.promedio;

    res.status(200).json(tasaBcv);

  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener tasa de cambio',
      detalles: error.message
    });
  }
}
