import app from "./src/app.js"
import pool from "./src/config/database.js"

const iniciarServidor = async () => {
    try {
        await pool.query("SELECT NOW()")
        console.log("La conexion a la DB fue exitosa")

        const port = 3000

        app.listen(port, () => {
            console.log(`La app esta funcionando en el puerto ${port}`)
        })

    } catch (error) {
        console.error("Error en la DB:", error.message)
        process.exit(1)
    }
}

iniciarServidor()