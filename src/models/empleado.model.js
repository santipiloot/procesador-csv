import pool from "../config/database.js"

export const cargarEmpleados = async (query, values) => {
    const res = await pool.query(query, values)
    return res
}

export const obtenerEmails = async (emails) => {
    const res = await pool.query("SELECT email FROM empleados WHERE email = ANY($1)", [emails])
    return res
}