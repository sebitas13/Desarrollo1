
const mongoose = require('mongoose');

const sensorSchema = mongoose.Schema({

    

    lecturas : [],

    fecha : {
        type : Date,
        default : Date.now
    }
});


const Sensor = mongoose.model('Sensor',sensorSchema);

module.exports = {
    Sensor
}

