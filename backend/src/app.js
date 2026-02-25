import express from "express"
import empleadoRouter from "./routes/empleado.route.js"
import errorHandler from "./middlewares/errorHandler.middleware.js"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/empleados", empleadoRouter)

// Funcion que responde a una peticion hacia un endpoint que no existe 
app.use((req, res) => {
    return res.status(404).json({ 
        success: false,
        message: "Endpoint no encontrado"
    })
})

app.use(errorHandler);


export default app