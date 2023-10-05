const {response,query} = require('express');
const Sensor= require('../models/sensor');

const lecturaSensores = async (req=query,res=response) => {
    try {

        const lecturas = await Sensor.find({});
        // console.log(lecturas);
        res.status(200).json({
            "success" : true,
            "message" : "lecturas",
            "data"    : lecturas
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
    lecturaSensores,
}