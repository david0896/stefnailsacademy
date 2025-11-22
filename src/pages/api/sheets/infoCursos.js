export default async function handler(req, res) {

  const MONEDAS = {
    "USD" : "USD",
    "EUR" : "EUR",
  };

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SPREADSHEET_ID}/values/Cursos!A1:K7?key=${process.env.GOOGLE_API_KEY}`;

    // tasa de cambio USD
    const tasaResponse = await fetch(`${process.env.BASE_URL}/api/tasaCambiaria/bcv`);
    
    if (!tasaResponse.ok) {
      throw new Error(`Error al obtener tasa de cambio: ${tasaResponse.statusText}`);
    }

    const tasaCambioUsd = await tasaResponse.json();

    // tasa de cambio EUR
    const tasaEurResponse = await fetch(`${process.env.BASE_URL}/api/tasaCambiaria/bcvEuro`);
    
    if (!tasaEurResponse.ok) {
      throw new Error(`Error al obtener tasa de cambio: ${tasaEurResponse.statusText}`);
    }

    const tasaCambioEur = await tasaEurResponse.json();

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.values || data.values.length < 2) {
      return res.status(200).json({ mensaje: 'No hay datos después de los encabezados', datos: data.values || [] });
    }

    const cursos = data.values.slice(1).map((row, index) => {

      const [
        Nombre, Descripcion, FechaLimiteIncripcion, Modo, Nivel, HorasAcademicas,
        DiasDeClases, Instructor, Divisa, Precio, Imagen, Estatus
      ] = row;

      const [day, month, year] = FechaLimiteIncripcion.split('/').map(Number);
      const fechaObj = new Date(year, month - 1, day);
      const fechaFormateada = new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(fechaObj);


      const formatoPrecio = {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
      };

      const precioConvertido = Divisa === MONEDAS.USD ? Number((Precio * tasaCambioUsd).toFixed(2)) : Number((Precio * tasaCambioEur).toFixed(2));

      return {
        id: index + 1,
        nombre: Nombre?.trim() || '',
        descripcion: Descripcion?.trim() || '',
        fecha: fechaFormateada,
        fechaSnFormato: FechaLimiteIncripcion?.trim(),
        modo: Modo?.trim() || '',
        nivel: Nivel.trim() || "",
        horas_academicas: parseInt(HorasAcademicas) || 0,
        clases: {
          cantidad: parseInt(DiasDeClases) || 0,
          instructor: Instructor?.trim() || ''
        },
        precio: precioConvertido.toLocaleString('es-ES', formatoPrecio) || 0,
        //precio: 0,
        imagen: Imagen?.trim() || '',
        estatus: Estatus?.trim() || '',
      };
    });

    res.status(200).json(cursos);

  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener cursos',
      detalles: error.message
    });
  }
}
