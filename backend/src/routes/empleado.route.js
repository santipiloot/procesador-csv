import { Router } from "express";
import { cargarEmpleados, obtenerEmpleados } from "../controllers/empleado.controller.js";
import uploadCsv from "../middlewares/uploadCsv.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router()

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            success: false,
            error: "Demasiadas peticiones, intenta de nuevo en 1 hora",
        });
    },
})

router.post("/importar", limiter, uploadCsv.single("archivo"), cargarEmpleados)
router.get("/", obtenerEmpleados)
export default router