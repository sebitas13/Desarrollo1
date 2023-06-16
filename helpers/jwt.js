const jwt  = require('jsonwebtoken');


const generarToken = async (user) =>{
    const payload = {

        sub : user._id,
        nombre: user.nombre,
        correo : user.correo
    };

    const token = jwt.sign(payload,process.env.SECRETORPRIVATEKEY,{
        expiresIn : '24h'
    })

    //console.log('Token generado: ',token)
    return token;
}



module.exports = {
    generarToken
}