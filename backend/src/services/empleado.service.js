import { parse } from "csv-parse/sync"
import empleadoSchema from "../schemas/empleado.schema.js"
import { chunkArray, normalizarTextos } from "../utils/empleado.util.js"
import {
    cargarEmpleados as cargarEmpleadosModel,
    obtenerEmails,
    conexionUnica,
    obtenerTodosLosEmpleados as obtenerTodosModel
} from "../models/empleado.model.js"

export const cargarEmpleados = async (buffer) => {

    // Pedimos la conexion unica al pool para empezar la transaccion
    const cliente = await conexionUnica();

    try {
        await cliente.query('BEGIN');

        const maxErrores = 20; // Para devolver en el Json un maximo de 20 errores en el caso de que haya muchos
        const bufferForm = buffer.toString("utf-8")


        // Intentamos el parseo
        let empleados;

        try {
            empleados = parse(bufferForm, {
                columns: true,
                skip_empty_lines: true,
            });
        } catch (parseError) {
            const error = new Error("El formato del archivo CSV es inválido o está corrupto.");
            error.status = 400; 
            throw error;
        }

        if (empleados.length === 0) {
            const errorVacio = new Error("El archivo CSV está vacío.");
            errorVacio.status = 400;
            throw errorVacio;
        }

        const exitosos = []
        const erroneos = []
        const empleadosDuplicadosCsv = []
        const emailSet = new Set()

        // Bucle que recorre a cada empleado, lo valida con el schema Zod y divide en exitosos o erroneos
        // A los que pasan las validaciones los vuelve a filtrar 
        // para buscar que no se repita en el Csv que estamos procesando en este momento
        for (const [index, empleado] of empleados.entries()) {
            const resultado = empleadoSchema.safeParse(empleado)
            if (resultado.success) {
                const empleadoNormalizado = {}
                Object.entries(resultado.data).forEach(([key, value]) => {
                    empleadoNormalizado[key] = normalizarTextos(value)
                })

                if (emailSet.has(empleadoNormalizado.email)) {
                    empleadosDuplicadosCsv.push({ fila: index + 2, empleado: empleadoNormalizado })
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

        // Filtramos los email de los exitosos para buscar que no esten cargados ya en la base de datos
        const emails = exitosos.map(e => e.email)
        let existentesSet = new Set()

        if (emails.length > 0) {
            const { rows } = await obtenerEmails(cliente, emails)
            existentesSet = new Set(rows.map(r => r.email))
        }

        const empleadosDuplicadosDb = []
        const empleadosFiltrados = []

        // Filtra el email de los exitosos y los compara si ya estan cargados en la db
        for (const empleado of exitosos) {
            if (existentesSet.has(empleado.email)) {
                empleadosDuplicadosDb.push(empleado)
            } else {
                empleadosFiltrados.push(empleado)
            }
        }

        // Para evitar enviar 1000 empleados a la vez y exigir a la DB, hacemos bulk insert diviendo en el array de empleados 
        // Hacemos batching y separamos el array en lotes de hasta 500 empleados para ingresar a la db
        const arrayPartido = chunkArray(empleadosFiltrados, 500)

        let totalInsertados = 0;

        // Armamos la query y los valores de forma dinamica
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


            const res = await cargarEmpleadosModel(cliente, query, values)
            totalInsertados += res.rowCount

        }

        // Respuesta a la peticion, incluye mucha informacion para saber donde se fallo, cuantos y cuales duplicados habia, etc.
        const resumen = {
            procesados: empleados.length,
            insertados: totalInsertados,
            duplicadosCsv: {
                total: empleadosDuplicadosCsv.length,
                data: empleadosDuplicadosCsv
            },
            duplicadosDb: {
                total: empleadosDuplicadosDb.length,
                data: empleadosDuplicadosDb
            },
            erroneos: {
                total: erroneos.length,
                data: erroneos.slice(0, maxErrores)
            },
            hayMasErrores: erroneos.length > maxErrores
        }
        await cliente.query('COMMIT');
        return resumen
    } catch (error) {
        if (cliente) await cliente.query('ROLLBACK');
        console.error("Error en la carga de de datos:", error.message)
        throw error;
    } finally {
        // Dejamos que la conexion vuelva al pool
        if (cliente) cliente.release()
    }
}

export const obtenerEmpleados = async () => {
    return await obtenerTodosModel()
}