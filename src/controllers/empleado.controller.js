import { cargarEmpleados as cargarEmpleadosService} from "../services/empleado.service.js"

export const cargarEmpleados = async (req, res, next) => {
    try {
    // Si multer no detecta/recibe un archivo enviamos un error 400
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Debes incluir un archivo en la peticion"
        })
    }

    // Llama al service y retorna el 200
    const resultado = await cargarEmpleadosService(req.file.buffer)
    return res.status(200).json({ success: true, data: resultado})
} catch(error) {
    console.log("Error en cargarEmpleados:", error)
    next(error) // Envia todos los errores al middleware para los errores
}
}