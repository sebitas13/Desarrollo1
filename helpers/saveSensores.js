const Sensor = require('../models/sensor');


const saveSensores = async (array_sensores) => {
    try {
       
        const sensor = await Sensor
            .findOneAndUpdate({name : 'sensores'},
            {
                lecturas : array_sensores,
                fecha : new Date()
            },
            { new: true ,
                upsert: true, // Crea el documento si no existe
                setDefaultsOnInsert: true
            }
            )
            
            console.log('sensores actualizado :',sensor);
    } catch (error) {
        console.log(error);   
    } finally{
        array_sensores.length = 0;
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
             ldr :  Math.floor(Math.random() * (1000 - 10) + 10),
             pir :  Math.floor(Math.random() * (100 - 10) + 10),
               // Fecha :  (new Date().toLocaleString())
             Fecha_d : date,
             Fecha :  date.getTime()
     }
}

const sendSensorSimulated = () => {
        cron.schedule("*/5 * * * * *", ()=>{
                console.log('Enviando tarea programada');
                const obj = simularDatos();
               // array_sensores.push(obj); para usar con saveSensorsCron
                socket.emit('lecturas',JSON.stringify(obj));
         });
}

// const saveSensorsCronMongo = (array_sensores) => {
//         //cron.schedule("*/15 * * * *",()
//         cron.schedule("*/15 * * * *",()=>{
//             saveSensores(array_sensores);
//             console.log('save in mongodb');
//         });
// }


module.exports = {
    saveSensores,
    simularDatos,
   // saveSensorsCronMongo,
    sendSensorSimulated
}