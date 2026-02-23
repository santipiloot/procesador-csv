import { Router } from "express";
import { cargarEmpleados, obtenerEmpleados } from "../controllers/empleado.controller.js";
import uploadCsv from "../middlewares/uploadCsv.middleware.js";

const router = Router()

router.post("/importar", uploadCsv.single("archivo"), cargarEmpleados)
router.get("/", obtenerEmpleados)
export default router