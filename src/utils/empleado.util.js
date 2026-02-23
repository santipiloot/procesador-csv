// Normalizamos textos para subirlos a la DB de forma uniforme 
export const normalizarTextos = (input) => {
    if (typeof input !== "string") {
        return input
    }

    return input.normalize("NFKC")
        .toLocaleLowerCase()
        .trim()
        .replace(/\s+/g, " ")
}

// Funcion que hace el batching y devuelve los chunks
export const chunkArray = (array, tamanio) => {

    if (tamanio <= 0) throw new Error("El tamaño del chunk no puede ser 0 o negativo")

    const arrayPartido = []

    for (let i = 0; i < array.length; i += tamanio) {
        arrayPartido.push(array.slice(i, i + tamanio))
    }

    return arrayPartido;
}

