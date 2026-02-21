import { cargarEmpleados as cargarEmpleadosService} from "../services/empleado.service.js"

export const cargarEmpleados = async (req, res) => {
    try {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Debes incluir un archivo en la peticion"
        })
    }

    const resultado = await cargarEmpleadosService(req.file.buffer)
    return res.status(200).json({ success: true, data: resultado})
} catch(error) {
    console.log("Error en cargarEmpleados:", error)
    return res.status(500).json({
        success: false,
        message: "Error interno del servidor"
    })
}
}