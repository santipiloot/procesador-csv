import multer from "multer"

// Middlware para manejar errores de forma global y no repetir el codigo en cada controller
const errorHandler = (err, req, res, next) => {
  console.error(`Error ${err.message}`)

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "El archivo supera el tamaño maximo permitido (5MB)"
      })
    }

    return res.status(400).json({
      success: false,
      error: "Error al procesar el archivo"
    })
  }

  if (err.message === "El archivo debe ser CSV") {
    return res.status(400).json({
      success: false,
      error: err.message
    })
  }

  const status = err.status || 500
  const message = err.message || "Error interno del servidor"

  res.status(status).json({
    success: false,
    error: message
  })
}

export default errorHandler