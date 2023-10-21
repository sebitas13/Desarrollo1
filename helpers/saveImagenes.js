const Imagen = require('../models/imagen');
const {notificarIntruso} = require('../helpers/notificar');

const saveImagenes = async (array_imagenes,estadoNotifiacion) => {
    try {
        const imagen = await Imagen.findOne({}).sort({ _id: -1 });

        if(imagen===null){
            const imagen = new Imagen({
                lecturas : array_imagenes,
                fecha : new Date()
            })
            
            imagen.save();
            console.log('Nuevo');
        }else if(imagen.lecturas.length>50 ){
            const imagen = new Imagen({
                lecturas : array_imagenes,
                fecha : new Date()
            })
            
            imagen.save();
            console.log('Nueva coleccion');
            
        }else{

            await Imagen.findOneAndUpdate(
                {},
                {
                    $push: { lecturas: { $each: array_imagenes } },
                    fecha: new Date()
                },
                { sort: { _id: -1 }, upsert: true, new: true }
            );

            console.log('Actualizando imagenes');
        } 
    } catch (error) {
        console.log(error);   
    } finally{
        array_imagenes.length = 0;
        if(estadoNotifiacion){
            notificarIntruso();
        }
       
    }
}

const saveImagesMongo = (array_imagenes,estadoNotifiacion) => {

        
        if(array_imagenes.length > 4){
             saveImagenes(array_imagenes,estadoNotifiacion);
             //array_imagenes.length = 0;
             console.log('save images in mongodb');
        } 
}



module.exports = {
    saveImagenes,
    saveImagesMongo
}