import pool from "../config/database.js"

export const cargarEmpleados = async (cliente, query, values) => {
    const res = await cliente.query(query, values)
    return res
}

export const obtenerEmails = async (cliente, emails) => {
    const res = await cliente.query("SELECT email FROM empleados WHERE email = ANY($1)", [emails])
    return res
}

export const conexionUnica = () => { return pool.connect() }