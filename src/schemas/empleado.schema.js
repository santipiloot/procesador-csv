import { z } from "zod"

// Configuramos el Schema de zod para las validaciones
const empleadoSchema = z.object({
    nombre: z.string().trim().min(3), 
    apellido: z.string().trim().min(3),
    email: z.email().toLowerCase().trim(), 
    telefono: z.string().regex(/^\d{10,15}$/),  // Permite solo entre 10 a 15 digitos
    cargo: z.string().trim().min(2),
    departamento: z.string().trim().min(2),
    salario: z.coerce.number().positive() // Transforma el String de salario a numero
})

export default empleadoSchema   