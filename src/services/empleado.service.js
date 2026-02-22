import { parse } from "csv-parse/sync"
import empleadoSchema from "../schemas/empleado.schema.js"
import { chunkArray, normalizarTextos } from "../utils/empleado.util.js"
import { cargarEmpleados as cargarEmpleadosModel, obtenerEmails } from "../models/empleado.model.js"

export const cargarEmpleados = async (buffer) => {
    const maxErrores = 20;
    const bufferForm = buffer.toString("utf-8")

    const empleados = parse(bufferForm, {
        columns: true,
        skip_empty_lines: true,
    })

    const exitosos = []
    const erroneos = []
    const empleadosDuplicadosCsv = []
    const emailSet = new Set()

    for (const [index, empleado] of empleados.entries()) {
        const resultado = empleadoSchema.safeParse(empleado)
        if (resultado.success) {
            const empleadoNormalizado = {}
            Object.entries(resultado.data).forEach(([key, value]) => {
                empleadoNormalizado[key] = normalizarTextos(value)
            })

            if (emailSet.has(empleadoNormalizado.email)) {
                empleadosDuplicadosCsv.push({ fila: index + 2, empleadoNormalizado })
            } else {
                emailSet.add(empleadoNormalizado.email)
                exitosos.push(empleadoNormalizado)
            }

        } else {
            erroneos.push({
                fila: index + 2,
                errores: resultado.error.issues.map(issue => ({
                    campo: issue.path,
                    mensaje: issue.message
                }))
            })
        }
    }

    const emails = exitosos.map(e => e.email)
    let existentesSet = new Set()

    if (emails.length > 0) {
        const { rows } = await obtenerEmails(emails)
        existentesSet = new Set(rows.map(r => r.email))
    }

    const empleadosDuplicadosDb = []
    const empleadosFiltrados = []

    for (const empleado of exitosos) {
        if (existentesSet.has(empleado.email)) {
            empleadosDuplicadosDb.push(empleado)
        } else {
            empleadosFiltrados.push(empleado)
        }
    }


    const arrayPartido = chunkArray(empleadosFiltrados, 500)

    let totalInsertados = 0;

    for (const parte of arrayPartido) {
        const values = []
        const placeholders = []
        let contador = 1

        for (const fila of parte) {
            values.push(fila.nombre)
            values.push(fila.apellido)
            values.push(fila.email)
            values.push(fila.telefono)
            values.push(fila.cargo)
            values.push(fila.departamento)
            values.push(fila.salario)

            placeholders.push(`($${contador}, $${contador + 1}, $${contador + 2}, $${contador + 3}, $${contador + 4}, $${contador + 5}, $${contador + 6})`)

            contador += 7
        }

        const query = `INSERT INTO empleados (nombre, apellido, email, telefono, cargo, departamento, salario)
                       VALUES ${placeholders.join(',')}
                       ON CONFLICT (email) DO NOTHING`

        try {
            const res = await cargarEmpleadosModel(query, values)
            totalInsertados += res.rowCount
        } catch (error) {
            console.error(`Error al insertar la parte entre las filas ${parte[0].email} - ${parte[parte.length - 1].email}:`, error.message)
        }
    }

    const resumen = {
        procesados: empleados.length,
        exitosos: empleadosFiltrados.length,
        totalInsertados,
        empleadosDuplicadosCsv: {total: empleadosDuplicadosCsv.length, data: empleadosDuplicadosCsv},
        empleadosDuplicadosDb: {total: empleadosDuplicadosDb.length, data: empleadosDuplicadosDb},
        erroneos: {total: erroneos.length, data: erroneos.slice(0, maxErrores)},
        hayMasErrores: erroneos.length > maxErrores
    }

    return resumen
}