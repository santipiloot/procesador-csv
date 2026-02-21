import { cargarEmpleados as cargarEmpleadosService} from "../services/empleado.service.js"

export const cargarEmpleados = (req, res) => {
    const resultado = cargarEmpleadosService(req.file.buffer)
    return res.json({ success: true })
}