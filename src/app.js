import express from "express"
import empleadoRouter from "./routes/empleado.route.js"

const app = express()

app.use(express.json())

app.use("/empleados", empleadoRouter)

export default app