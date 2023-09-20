
const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async (req=request,res=response,next) => {
    
    
    
    try {

        const token = req.header('authorization');
        if(!token || token===null){
            return res.status(401).json({
                "success" : false,
                "message" : "Token no definido"
            });
        }
        const payload = jwt.verify(token,process.env.SECRETORPRIVATEKEY);

        //Lectura del usuario que corresponde al uid
        // console.log(payload);

         const userId = payload.sub;
         const userAuthentified = await Usuario.findOne({_id:userId});

        if(!userAuthentified){
            return res.status(401).json({
                "success" : false,
                "message" : "El usuario no existe en la BD"
            });
        }

        if(!userAuthentified.estado){
            return res.status(401).json({
                "success" : false,
                "message" : "Usuario dado de baja"
            });
        }

        req.usuario = userAuthentified;
        next();

    } catch (error) {
        return res.status(401).json({
            "success" : false,
            "message" : "Token no valido"
        });
     }

    
}



module.exports = {
    validarJWT
}