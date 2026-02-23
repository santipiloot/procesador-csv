// Middlware para manejar errores de forma global y no repetir el codigo en cada controller
const errorHandler = (err, req, res, next) => {
    console.error(`Error ${err.message}`)

    const status = err.status || 500
    const message = err.message || "Error interno del servidor"

    res.status(status).json({success: false, error: message})
}

export default errorHandler