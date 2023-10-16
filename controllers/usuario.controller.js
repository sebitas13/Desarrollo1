const {response,query} = require('express');
const Usuario = require('../models/usuario');


const bcrypt = require('bcrypt');
const {generarToken} = require('../helpers/jwt')

const usuarioGet = async (req=query,res=response) => {

    const {limite = 5 , desde = 0} = req.query;

    const query = {estado : true};

    try {
        const usuarios = await Usuario
        .find(query)
        .limit(limite)
        .skip(desde)
    
        res.status(200).json({
            "success" : true,
            "mensaje":'Lista de usuarios',
            "data" : usuarios
        })
    } catch (error) {
        
        res.status(400).send({
            "success": false,
            "mensaje":'No se pudo obtener la lista de usuarios',
            "errors":error
        });    
    }
} 

const usuarioPost = async (req=query,res=response) => {
    
    const {nombre,correo,password} = req.body;
    
    try {
        const usuario = new Usuario({
            nombre : nombre,
            correo : correo,
            password : password
        });
    
        //Encriptar la contraseña con bcrypt
        bcrypt.hash(password,10, (err,hash)=> {
            if(err){
                //console.error('Error al generar el hash de la contraseña:', err);
                res.status(400).json({
                    "success": false,
                    "message":'Error server hash',
                    "errors":err
                });
                return;
            }  
            
            usuario.password = hash;
            usuario.save();
    
            res.status(201).json({
                success: true,
                message: "Usuario creado exitosamente",
                data: usuario,
            });
    
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "No se pudo crear el usuario",
            errors: error,
          });
    }

   
} 

const usuarioPut = async (req=query,res=response) => {

    const {id} = req.params;

    //const {_id,correo,password,...otros} = req.body;
    const {_id,correo,password,...otros} = req.body;

   
    try {
        if(password){
            console.log("Con contraseña");
            bcrypt.hash(password,10, async (error,hash)=>{
                if(error){
                    res.status(400).json({
                        "success": false,
                        "mensaje":'Error server hash',
                        "errors":err
                    });
                    return;
                }  
                otros.password = hash;
                const usuario = await Usuario.findByIdAndUpdate(id,otros,{new:true}); //new true para obtener el dato actualizado
                res.status(200).json({
                    "success": true,
                    "message": "Usuario actualizado exitosamente",
                    "updatedAt": new Date(),
                    "data" : usuario
                })
                
            })
            
        }else{
            console.log("Sin contraseña");
            const usuario = await Usuario.findByIdAndUpdate(id,otros,{new:true});
            res.status(200).json({
                "success": true,
                "message": "Usuario actualizado exitosamente",
                "updatedAt": new Date(),
                "data" : usuario
            })
        }
    } catch (error) {
        res.status(400).json({  
            "success": false,
            "message" : "No se pudo actualizar el usuario",
            "errors":error
        });
    }

} 

const usuarioDelete = async (req=query,res=response) => {
    const {id} = req.params;
    console.log(req.usuario.correo);
    try {
        if(req.usuario.correo == "admin@gmail.com"){
            const usuario = await Usuario.findByIdAndUpdate(id,{estado:false},{new:true})
            res.status(200).json({ //204
                "success" : true,
                "message" : "Usuario eliminado",
                "data"    : usuario
                
            })
        }else{
            res.status(500).send({message:'No eres admin para borrar'});
        }
    } catch (error) {
        res.status(400).json({
            "success" : false,
            "message" : "No se pudo eliminar el usario",
            "errors" : error
        });
    }
} 

const usuario_login = async (req=query,res=response) => {

    const {correo,password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo:correo});

        if(!usuario){
            return res.status(400).json({
                "success" : false,
                "message" : "Correo no existe"
            })
        }
    
        if(!usuario.estado){
            return res.status(400).json({
                "success" : false,
                "message" : "El usuario esta dado de baja"
            }) //HTTP 400 Bad Request
        }
    
        bcrypt.compare(password,usuario.password,async (err,isMatch)=> {
            if (err) {
                return res.status(500).json({ error: 'Error al comparar las contraseñas' }); // Internal Server Error 500
            }
    
            if (isMatch) {

                const token = await generarToken(usuario)
                //console.log('token devuelto: ',token);

                return res.status(200).json({ 
                    "success" : true,
                    "message" : "Inicio de sesion exitoso",
                    "data" : usuario,
                    "token" : token
                 }) // ok
            } else {
                return res.status(401).json({
                    "success" : false,
                    "message" : "Contraseña no coincide",
                }) // 401 Unauthorized las credenciales proporcionadas no son válidas
            }
        })


    } catch (error) {
        return res.status(500).json({
            "success" : false,
            "message" : "Comuniquese con el Admin",
             "errors" : error
        })
    }

}

const autorizar = async (req=query,res=response) => {
   
    
    try {
        res.status(200).json({ //204
            "success" : true,
            "message" : "Usuario autorizado",
            "data"    : req.usuario
            
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
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioDelete,
    usuario_login,
    autorizar,

}