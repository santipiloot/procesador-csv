import multer from "multer"

const storage = multer.memoryStorage()
// Configuramos Multer 
// Usamos memoria ram pero la limitamos a 5MB (suficiente para archivos CSV)

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "text/csv"){
        cb(null, true)
    }else{
        cb(new Error("El archivo debe ser CSV"), false)
    }
}

const uploadCsv = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export default uploadCsv