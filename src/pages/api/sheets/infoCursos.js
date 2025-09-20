export default async function handler(req, res) {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SPREADSHEET_ID}/values/Cursos!A1:K7?key=${process.env.GOOGLE_API_KEY}`;

    // Llamada a la API de tasa de cambio
    const tasaResponse = await fetch(`${process.env.BASE_URL}/api/tasaCambiaria/bcv`);
    
    if (!tasaResponse.ok) {
      throw new Error(`Error al obtener tasa de cambio: ${tasaResponse.statusText}`);
    }

    const tasaCambio = await tasaResponse.json();

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
        nombre, descripcion, fechaStr, modo, nivel, horas,
        cantClases, instructor, precio, imagen, estatus
      ] = row;

      const [day, month, year] = fechaStr.split('/').map(Number);
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
      const precioConvertido = Number((precio * tasaCambio).toFixed(2));

      return {
        id: index + 1,
        nombre: nombre?.trim() || '',
        descripcion: descripcion?.trim() || '',
        fecha: fechaFormateada,
        fechaSnFormato: fechaStr?.trim(),
        modo: modo?.trim() || '',
        nivel: parseInt(nivel) || 0,
        horas_academicas: parseInt(horas) || 0,
        clases: {
          cantidad: parseInt(cantClases) || 0,
          instructor: instructor?.trim() || ''
        },
        precio: precioConvertido.toLocaleString('es-ES', formatoPrecio) || 0,
        //precio: 0,
        imagen: imagen?.trim() || '',
        estatus: estatus?.trim() || '',
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
