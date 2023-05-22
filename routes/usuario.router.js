const express = require('express');

const { usuarioGet,
        usuarioPost,
        usuarioPut,
        usuarioDelete
} = require('../controllers/usuario.controller');


const router = express.Router();

router.get('/',usuarioGet);

router.post('/',usuarioPost);

router.put('/:id',usuarioPut);

router.delete('/:id',usuarioDelete);

module.exports = router;