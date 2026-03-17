import { z } from "zod"

// Configuramos el Schema de zod para las validaciones
const empleadoSchema = z.object({
    nombre: z.string().trim().min(3, "El nombre debe tener al menos 3 letras"),
    apellido: z.string().trim().min(3, "El apellido debe tener al menos 3 letras"),
    email: z.email("Formato de email inválido").toLowerCase().trim(),
    telefono: z.string().trim().regex(/^\d{10,15}$/, "El teléfono debe tener entre 10 y 15 dígitos"),
    cargo: z.string().trim().regex(/^(?=(?:.*[a-zA-ZáéíóúÁÉÍÓÚñÑ]){2,})[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/, "El cargo debe tener al menos 2 letras"),
    departamento: z.string().trim().regex(/^(?=(?:.*[a-zA-ZáéíóúÁÉÍÓÚñÑ]){2,})[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/, "El depto debe tener al menos 2 letras"),
    salario: z.coerce.number().positive("El salario debe ser un número positivo")
})

export default empleadoSchema   