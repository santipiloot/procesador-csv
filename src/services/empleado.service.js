import { parse } from "csv-parse/sync"
import empleadoSchema from "../schemas/empleado.schema.js"

export const cargarEmpleados = (buffer) => {
    const filas = buffer.toString("utf-8")

    const empleados = parse(filas, {
        columns: true,
        skip_empty_lines: true,
    })

    const exitosos = []
    const erroneos = []

    empleados.forEach((empleado, index) => {
        const resultado = empleadoSchema.safeParse(empleado)
        if (resultado.success) {
            exitosos.push(resultado.data)
        } else {
            erroneos.push({
                fila: index + 2,
                errores: resultado.error.issues.map(issue => ({
                    campo: issue.path,
                    mensaje: issue.message
                }))
            })
        }
    })

    const resumen = {
        procesados: empleados.length,
        exitosos: exitosos.length,
        erroneos: erroneos.length,
        errores: erroneos
    }

    return resumen

}