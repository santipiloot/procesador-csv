import { z } from "zod"

const empleadoSchema = z.object({
    nombre: z.string().normalize().trim().min(3), 
    apellido: z.string().normalize().trim().min(3),
    email: z.email().toLowerCase().trim(), 
    telefono: z.coerce.number().int().positive().min(10), 
    cargo: z.string().normalize().trim().min(2),
    departamento: z.string().normalize().trim().min(2),
    salario: z.coerce.number().positive()
})

export default empleadoSchema