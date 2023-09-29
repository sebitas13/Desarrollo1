const Imagen = require('../models/imagen');


const saveImagenes = async (array_imagenes) => {
    try {
        const imagen = await Imagen.findOne({}).sort({ _id: -1 });

        if(imagen.length === 0 || imagen.lecturas.length>100){
            const imagen = new Imagen({
                lecturas : array_imagenes,
                fecha : new Date()
            })
            
            imagen.save();
            console.log('creado');
            
        }else{

            await Imagen.findOneAndUpdate(
                {},
                {
                    $push: { lecturas: { $each: array_imagenes } },
                    fecha: new Date()
                },
                { sort: { _id: -1 }, upsert: true, new: true }
            );

            //console.log('sensores  :',sensor);
        } 
    } catch (error) {
        console.log(error);   
    }
}




module.exports = {
    saveImagenes,
    
}