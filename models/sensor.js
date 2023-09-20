
const mongoose = require('mongoose');

const sensorSchema = mongoose.Schema({

    name : {
        type : String,
        default : 'sensores'
    },
    lecturas : [],

    fecha : {
        type : Date,
        default : Date.now
    }
});


const Sensor = mongoose.model('Sensor',sensorSchema);

module.exports = Sensor

