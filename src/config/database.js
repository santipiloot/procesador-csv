import { Pool } from "pg";
// Instanciamos y configuramos el objeto pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    max: 10, 
    idleTimeoutMillis: 30000, // Cierra las conexiones inactivas despues de 30 segundos
    connectionTimeoutMillis: 2000, // Tiempo maximo de 2 segundos para esperar una conexion disponible
})

export default pool