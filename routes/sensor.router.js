const express = require('express');

const { 
    lecturaSensores,
} = require('../controllers/sensor.controller');

const router = express.Router();
router.get('/lectura-sensores',lecturaSensores);

module.exports = router;