//configuracion de multer para subir audios en memoria buffer
//audio disponible en req.file.buffer 

import multer from "multer";

export const uploadAudio = multer({

  storage: multer.memoryStorage(),

  //Limitar audios por request para no saturar la ram y romper servidor
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 1
  },


  fileFilter(req, file, cb) {


    //Formato de audio permitido:
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/mp4"
    ];

    if (allowedTypes.includes(file.mimetype)) {

      cb(null, true);

    } else {

      cb(new Error("Invalid audio format"));
    }

  }

});