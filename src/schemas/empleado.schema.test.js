import empleadoSchema from "./empleado.schema.js"
import { describe, it, expect } from "vitest"

describe("Validacion de datos del Empleado (con schema Zod)", () => {
    const empleadoValido = {
        nombre: "Santino",
        apellido: "Pilot",
        email: "correovalido@gmail.com",
        telefono: "14572834657",
        cargo: "Desarrollador",
        departamento: "IT",
        salario: "900000.20"
    }

    it("debe validar correctamente un empleado valido", () => {
        const resultado = empleadoSchema.safeParse(empleadoValido)
        expect(resultado.success).toBe(true)
        expect(resultado.data.nombre).toBe(empleadoValido.nombre)
    })

    it("debe fallar la validacion si el email no es valido", () => {
        const empleadoInvalido = { ...empleadoValido, email: "email-invalido" }
        const resultado = empleadoSchema.safeParse(empleadoInvalido)
        expect(resultado.success).toBe(false)
        expect(resultado.error.issues[0].path).toContain("email")
    })

    it("debe fallar si hay un dato faltante en el empleado", () => {
        const { nombre, ...empleadoInvalido } = empleadoValido
        const resultado = empleadoSchema.safeParse(empleadoInvalido)
        expect(resultado.success).toBe(false)
        expect(resultado.error.issues[0].path).toContain("nombre");
    })

    it("debe fallar si el salario es negativo o 0", () => {
        const empleadoInvalido = { ...empleadoValido, salario: "-330000" }
        const resultado = empleadoSchema.safeParse(empleadoInvalido)
        expect(resultado.success).toBe(false)
        expect(resultado.error.issues[0].path).toContain("salario")
    })

    it("debe realizar el cambio de tipo del salario a numero", () => {
        const resultado = empleadoSchema.safeParse(empleadoValido)
        expect(resultado.success).toBe(true)
        expect(resultado.data.salario).toBeTypeOf("number")
    })

    it("debe fallar si el nombre es un string vacio o solo espacios", () => {
        const empleadoInvalido = { ...empleadoValido, nombre: "   " };
        const resultado = empleadoSchema.safeParse(empleadoInvalido);
        expect(resultado.success).toBe(false);
    });

    it("debe fallar si el salario no se puede convertir en numero", () => {
        const empleadoInvalido = { ...empleadoValido, salario: "hola" };
        const resultado = empleadoSchema.safeParse(empleadoInvalido);
        expect(resultado.success).toBe(false);
    });
})