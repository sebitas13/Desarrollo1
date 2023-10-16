const {response,query} = require('express');
const Imagen= require('../models/imagen');

const lecturaImagenes = async (req=query,res=response) => {
    try {

       // const imagen = await Imagen.findOne({}).sort({ _id: -1 });;
        const count = await Imagen.countDocuments();
        const pagina = req.query.page;
        const imagen2 = await Imagen.find({}).skip(pagina-1)  // Obtener todas las imágenes
        
        // console.log(lecturas);
        res.status(200).json({
            "success" : true,
            "message" : "lecturas",
            "data"    : imagen2,
            "numDoc" : count
        })

    } catch (error) {
        res.status(400).json({
            "success" : false,
            "message" : "Usuario no autorizado",
            "errors" : error
        });
    }
}

const elliminarImagenes = async (req=query, res = response) => {
    try {

        const result = await Imagen.deleteMany({});
        
        // console.log(lecturas);
        res.status(200).json({
            "success" : true,
            "message" : "eliminados",
            "data"    : result.deletedCount
        })

    } catch (error) {
        res.status(400).json({
            "success" : false,
            "message" : "Usuario no autorizado",
            "errors" : error
        });
    }
}


module.exports = {

    lecturaImagenes,
    elliminarImagenes
}