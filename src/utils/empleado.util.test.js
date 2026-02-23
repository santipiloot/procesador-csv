import { describe, it, expect } from "vitest"
import { chunkArray, normalizarTextos } from "./empleado.util.js"

describe("Emplados Utils", () => {
    describe("Funcion chunkArray", () => {

        it("debe dividir en la cantidad correcta de chunks indicado", () => {
            const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            const resultado = chunkArray(array, 2)
            expect(resultado).toHaveLength(5)
            expect(resultado[0]).toEqual([1, 2])
        })

        it("debe devolver un solo array vacio si el array enviado tambien esta vacio", () => {
            const array = []
            const resultado = chunkArray(array, 2)
            expect(resultado).toEqual([])
        })

        it("debe devolver un ultimo chunk mas pequeño si la division del array no es exacta", () => {
            const array = [1, 2, 3, 4, 5]
            const resultado = chunkArray(array, 2)
            expect(resultado).toEqual([[1, 2], [3, 4], [5]])
        })

        it("debe devolver un solo chunk si el array es mas pequeño que el tamaño de chunk indicado", () => {
            const array = [1, 2, 3]
            const resultado = chunkArray(array, 5)
            expect(resultado).toHaveLength(1)
            expect(resultado[0]).toEqual([1, 2, 3])
        })

        it("debe devolver un solo chunk igual al array original si tamaño indicado es el mismo del array", () => {
            const array = [1, 2, 3]
            const resultado = chunkArray(array, 3)
            expect(resultado).toHaveLength(1)
            expect(resultado[0]).toEqual([1, 2, 3])
        })

        it("debe crear chunks de 1 elemento si el tamaño indicado es 1", () => {
            const array = [1, 2, 3]
            const resultado = chunkArray(array, 1)
            expect(resultado).toHaveLength(3)
            expect(resultado).toEqual([[1], [2], [3]])

        })

        it("debe lanzar un error al indicar un tamaño igual o menor a 0", () => {
            const array = [1, 2, 3]

            expect(() => chunkArray(array, 0)).toThrow("El tamaño del chunk no puede ser 0 o negativo");
            expect(() => chunkArray(array, -5)).toThrow();
        })
    })

    describe("Funcion normalizarTextos", () => {
        it("debe eliminar espacios vacios al principio y final", () => {
            const string = " santino pilot "
            const resultado = normalizarTextos(string)
            expect(resultado).toBe("santino pilot")
        })
        it("debe devolver el input original si no es un string", () => {
            const input = 123
            const resultado = normalizarTextos(input)
            expect(resultado).toBe(123)
        })
        it("debe eliminar espacios dobles (o mayor) entre el string", () => {
            const string = "santino   pilot"
            const resultado = normalizarTextos(string)
            expect(resultado).toBe("santino pilot")
        })
        it("debe normalizar todo el string a minusculas", () => { 
            const string = "SANTINO PilOt"
            const resultado = normalizarTextos(string)
            expect(resultado).toBe("santino pilot")
        })
        it("debe devoler un string vacio si el input esta vacio o lleno de espacios", () => {
            const string = "       "
            const resultado = normalizarTextos(string)
            expect(resultado).toBe("")
        })
    })

})