
const  Usuario = require('../models/usuario');


const existeCorreo = async (correo='') => {

    const existeCorreo = await Usuario.findOne({correo:correo});

    if(existeCorreo){
        throw new Error(`El correo ${correo} ya existe en la BD`);
    }
    
}

const existeIdMongo = async (id='') => {

    const existeid = await Usuario.findById(id);
    if(!existeid){
        throw new Error(`El id ${id} no existe en la BD`);
    }
}

module.exports = {
    existeCorreo,
    existeIdMongo
}