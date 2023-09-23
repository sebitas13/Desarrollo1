const Sensor = require('../models/sensor');


const saveSensores = async (array_sensores) => {
    try {
        const sensor = await Sensor.find({});
        if(sensor.length === 0){
            const sensor = new Sensor({
                lecturas : [],
                fecha : new Date()
            })
            
            sensor.save();
            console.log('creado');
            
        }else{
            const sensor = await Sensor
            .findOneAndUpdate({name : 'sensores'},
            {
                lecturas : array_sensores,
                fecha : new Date()
            },
            { new: true }
            )

            //console.log('sensores  :',sensor);
        }  
    } catch (error) {
        console.log(error);   
    }
}

const simularDatos = ()=>{
    let date = new Date();
                //let date = `${(new Date())}`;
                
    return {
             temp_c : Math.floor(Math.random() * 61),
             temp_f: Math.floor(Math.random() * (100 - 10) + 10),
             hume :  Math.floor(Math.random() * (100 - 10) + 10),
             s_ter :  Math.floor(Math.random() * (100 - 10) + 10),
             ldr :  Math.floor(Math.random() * (100 - 10) + 10),
             pir :  Math.floor(Math.random() * (100 - 10) + 10),
               // Fecha :  (new Date().toLocaleString())
             Fecha_d : date,
             Fecha :  date.getTime()
     }
}


module.exports = {
    saveSensores,
    simularDatos
}