import pool from "../config/database.js"

// Al usar transacciones debemos suar la misma conexion siempre 
// por eso se recibe cliente como parametro y se usa para las querys
export const cargarEmpleados = async (cliente, query, values) => {
    const res = await cliente.query(query, values)
    return res
}

export const obtenerEmails = async (cliente, emails) => {
    const res = await cliente.query("SELECT email FROM empleados WHERE email = ANY($1)", [emails])
    return res
}

export const conexionUnica = () => { return pool.connect() }

export const obtenerTodosLosEmpleados = async () => {
    // Usamos el poolporque es una lectura sin transacciones
    const { rows } = await pool.query("SELECT * FROM empleados ORDER BY id DESC")
    return rows
}