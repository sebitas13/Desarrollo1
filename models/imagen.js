
const mongoose = require('mongoose');

const imagenSchema = mongoose.Schema({

    name : {
        type : String,
        default : 'imagenes'
    },
    lecturas : [],

    fecha : {
        type : Date,
        default : Date.now
    }
});


const Imagen = mongoose.model('Imagen',imagenSchema);

module.exports = Imagen

