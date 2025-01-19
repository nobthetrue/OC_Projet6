const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { multer, optimizeImage } = require('../middleware/multer-config');
const booksCtrl = require('../controllers/books');

router.get('/bestrating', booksCtrl.takeThreeBestRating);
router.get('/', booksCtrl.getAllBooks);
router.post('/:id/rating', auth, booksCtrl.rateBook)
router.post('/', auth, multer, optimizeImage, booksCtrl.createBook);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, multer, optimizeImage, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;