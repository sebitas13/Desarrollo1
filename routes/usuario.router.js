const express = require('express');
const {check} = require('express-validator');
const validarCampos= require('../middlewares/validarCampos')
const { existeCorreo, existeIdMongo} = require('../helpers/db-validation');
const {validarJWT} = require('../middlewares/validator-jwt')

const { usuarioGet,
        usuarioPost,
        usuarioPut,
        usuarioDelete,
        usuario_login
} = require('../controllers/usuario.controller');

const validarPostUsuarios = [
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('correo','Correo no valido').isEmail(),
    check('correo').custom(existeCorreo),
    check('password','min 3 caracteres').isLength({min: 3}),
    validarCampos
]

const validarPutUsuarios = [
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeIdMongo),
    validarCampos
]

const validarDeleteUsuarios = [
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeIdMongo),
    validarCampos
]

const validarLogin = [
    check('correo','Correo obligatorio').not().isEmpty(),
    check('password','Password obligatorio').not().isEmpty(),
    validarCampos
]

const router = express.Router();

router.get('/',usuarioGet);

router.post('/',validarPostUsuarios,usuarioPost);   

router.put('/:id',validarPutUsuarios,usuarioPut);

router.delete('/:id',validarJWT,validarDeleteUsuarios,usuarioDelete);


router.post('/login',validarLogin,usuario_login);



module.exports = router;