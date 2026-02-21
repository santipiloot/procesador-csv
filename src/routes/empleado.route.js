import { Router } from "express";
import { cargarEmpleados } from "../controllers/empleado.controller.js";
import uploadCsv from "../middlewares/uploadCsv.middleware.js";

const router = Router()

router.use("/importar", uploadCsv.single("archivo"), cargarEmpleados)

export default router