import { Router } from "express";
import { cargarEmpleados, obtenerEmpleados } from "../controllers/empleado.controller.js";
import uploadCsv from "../middlewares/uploadCsv.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router()

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5, 
    message: {success: false, message: "Demasiados intentos, reintenta en 1 hora"}
})

router.post("/importar", limiter, uploadCsv.single("archivo"), cargarEmpleados)
router.get("/", obtenerEmpleados)
export default router