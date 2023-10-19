const Imagen = require('../models/imagen');


const saveImagenes = async (array_imagenes) => {
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
    }
}

const saveImagesMongo = (array_imagenes) => {

        
        if(array_imagenes.length > 4){
             saveImagenes(array_imagenes);
             array_imagenes.length = 0;
             console.log('save images in mongodb');
        } 
}



module.exports = {
    saveImagenes,
    saveImagesMongo
}