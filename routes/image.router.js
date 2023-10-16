const express = require('express');

const { 
    lecturaImagenes,
    elliminarImagenes
} = require('../controllers/image.controller');

const router = express.Router();
router.get('/lectura-imagenes',lecturaImagenes);
router.delete('/eliminar-imagenes',elliminarImagenes);

module.exports = router;