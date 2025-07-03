const express = require('express');
const Router = express.Router();
const { UsuarioController } = require('../controlers/controlador');

var usuarioController =  new UsuarioController() 
// RUTAS DE USUARIOS

Router.get('/listar', usuarioController.getUsuarios);               
Router.get('/detalle/:id', usuarioController.getUsuarioById);      
Router.delete('/eliminar/:id', usuarioController.eliminarUsuario); 
Router.put('/editar/:id', usuarioController.editarUsuario);

Router.post('/registro', usuarioController.crearUsuario);         
Router.post('/login', usuarioController.loginUsuario);            


module.exports = Router;