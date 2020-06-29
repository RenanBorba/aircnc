const multer = require('multer');
const path = require('path');

module.exports = {
  storage: multer.diskStorage({
    // __dirname = diretório global
    destination: path.resolve(__dirname,"..", "..", "uploads"),
    // Dados file, callback
    filename: (req, file, cb) => {
      /*
        Template Strings
        Nome do file no upload+data+extensão
      */
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    }
  })
};