const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'tmp')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.webp')
    }
})

const multerMiddleware = multer({ storage }).single('image');

const optimizeImage = async (req, res, next) => {
    if (!req.file) {
      return next(); // Pas de fichier à optimiser
    }
  
    const optimizedFileName = `${req.file.filename.split('.')[0]}_${Date.now()}.webp`;
    const outputPath = path.join('images', optimizedFileName);
  
    try {
      // Conversion en WebP avec Sharp (sans redimensionnement)
      await sharp(req.file.path)
        .resize(260)
        .webp({ quality: 80 }) // Conversion en WebP avec qualité de 80%
        .toFile(outputPath);
        
        console.log(req.file.path)
      // Supprimer l'image temporaire
    //   fs.unlinkSync(req.file.path);
        // const oldPath = req.file.path

  
      // Mettre à jour la requête avec les infos de l'image optimisée
      req.file.path = outputPath;
      req.file.filename = optimizedFileName;
  
      next();
    } catch (error) {
      console.error('Erreur lors de l\'optimisation de l\'image :', error);
      res.status(500).json({ error: 'Erreur lors du traitement de l\'image.' });
    }
  };
  
  module.exports = { multer: multerMiddleware, optimizeImage };