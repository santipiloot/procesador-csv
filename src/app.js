import express from "express"
import empleadoRouter from "./routes/empleado.route.js"

const app = express()

app.use(express.json())

app.use("/empleados", empleadoRouter)


app.use((req, res) => {
    return res.status(404).json({ 
        success: false,
        message: "Endpoint no encontrado"
    })
})

app.use(errorHandler);


export default app