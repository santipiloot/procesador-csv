import {parse} from "csv-parse/sync"

export const cargarEmpleados = (buffer) => {
    const datos = buffer.toString("utf-8")

    const datosParse = parse(datos, {
        columns: true
    })

    
}