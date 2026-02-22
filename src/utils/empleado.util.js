export const normalizarTextos = (input) => {
    if (typeof input !== "string") {
        return input
    }

    return input.normalize("NFKC")
        .toLocaleLowerCase()
        .trim()
        .replace(/\s+/g, " ")
}

export const chunkArray = (array, tamanio) => {
    const arrayPartido = []

    for (let i = 0; i < array.length; i += tamanio) {
        arrayPartido.push(array.slice(i, i + tamanio))
    }
    
    return arrayPartido;
}

