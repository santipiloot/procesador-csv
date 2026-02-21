export const normalizarTextos = (input) => {
    if (typeof input  !== "string") { 
        return input 
    }

    return input.normalize("NFKC")
    .toLocaleLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}