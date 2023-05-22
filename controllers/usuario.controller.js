const {response,query} = require('express');
const { Usuario } = require('../models/usuario');



const usuarioGet = async (req=query,res=response) => {

    const {limite = 3 , desde = 0} = req.query;

    const query = {estado : true};

    const usuarios = await Usuario
    .find(query)
    .limit(limite)
    .skip(desde)

    res.json({
        usuarios
    })
} 

const usuarioPost = async (req=query,res=response) => {

    const {nombre,correo,password} = req.body;

    const usuario = new Usuario({
        nombre : nombre,
        correo : correo,
        password : password
    });

    usuario.save();

    res.json({
        usuario
    })
} 

const usuarioPut = async (req=query,res=response) => {

    const {id} = req.params;

    const {password,...otros} = req.body;
    const usuario = await Usuario.findByIdAndUpdate(id,otros);

    res.json({
        usuario
    })
} 

const usuarioDelete = async (req=query,res=response) => {
    const {id} = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false})
    res.json({
        usuario
    })
} 


module.exports = {
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioDelete
}