const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'tmp')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        callback(null, name + Date.now() + '.webp')
    }
})

const multerMiddleware = multer({ storage }).single('image');

const optimizeImage = async (req, res, next) => {
    if (!req.file) {
      return next();
    }
  
    const optimizedFileName = `${req.file.filename.split('.')[0]}_${Date.now()}.webp`;
    const outputPath = path.join('images', optimizedFileName);
  
    try {
      await sharp(req.file.path)
        .resize(260)
        .webp({ quality: 80 })
        .toFile(outputPath);
        
        console.log(req.file.path)
  
      req.file.path = outputPath;
      req.file.filename = optimizedFileName;
  
      next();
    } catch (error) {
      console.error('Erreur lors de l\'optimisation de l\'image :', error);
      res.status(500).json({ error: 'Erreur lors du traitement de l\'image.' });
    }
  };
  
  module.exports = { multer: multerMiddleware, optimizeImage };