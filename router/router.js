const express = require('express');
const Router = express.Router();
const { UsuarioController } = require('../Models/Modelo');

var usuarioModel =  new UsuarioController() 

// RUTAS DE USUARIOS
Router.get('/listar', usuarioModel.getUsuarios);               
Router.get('/detalle/:id', usuarioModel.getUsuarioById);      
Router.delete('/eliminar/:id', usuarioModel.eliminarUsuario); 
Router.put('/editar/:id', usuarioModel.editarUsuario);

Router.post('/registro', usuarioModel.crearUsuario);         
Router.post('/login', usuarioModel.loginUsuario);            


module.exports = Router;