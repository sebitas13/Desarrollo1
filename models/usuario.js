const mongoose = require('mongoose');
const validator = require('validator')

const UsuarioSchema = mongoose.Schema({
    
    nombre : {
        type : String,
        required : [true,'El nombre es requerido']
    },

    correo : {
        type : String,
        required : [true,'Correo es requerido'],
        lowerCase : true,
        unique : true,
        validate : (value) => {
            return validator.isEmail(value);
        }
    },

    password : {
        type : String,
        required : [true,'la contraseña es requerida']
    },

    estado : {
        type : Boolean,
        default : true
    }

})


const Usuario = mongoose.model('Usuario',UsuarioSchema);

module.exports = {
    Usuario
}