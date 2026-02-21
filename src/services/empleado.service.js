import { parse } from "csv-parse/sync"
import empleadoSchema from "../schemas/empleado.schema.js"
import { normalizarTextos } from "../utils/empelado.util.js"

export const cargarEmpleados = (buffer) => {
    const maxErrores = 20;

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
            const empleadoNormalizado = {}
        
            Object.entries(resultado.data).forEach(([key, value]) => {
                empleadoNormalizado[key] = normalizarTextos(value)
            })

            exitosos.push(empleadoNormalizado)
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
        errores: erroneos.slice(0, maxErrores),
        hayMasErrores: erroneos.length > maxErrores 
    }

    return resumen

}