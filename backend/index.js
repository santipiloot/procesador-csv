import app from "./src/app.js"
import pool from "./src/config/database.js"

// Funcion para levantar el servidor solo si la DB se pudo conectar
const iniciarServidor = async () => {
    try {
        await pool.query("SELECT NOW()")
        console.log("La conexion a la DB fue exitosa")

        const port = process.env.PORT || 3000

        app.listen(port, () => {
            console.log(`La app esta funcionando en el puerto ${port}`)
        })

    } catch (error) {
        console.error("Error en la DB:", error.message)
        process.exit(1)
    }
}

// Funcion para cerrar las conexiones antes de que la app se cierre y evitar conexiones colgadas
const shutdown = async () => {
    console.log("Conexiones de la DB cerradas");
    await pool.end()
    setTimeout(() => {
        process.exit(0);
    }, 100);
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)


iniciarServidor()