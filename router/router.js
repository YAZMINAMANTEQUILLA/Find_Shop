const express = require('express');
const Router = express.Router();
const UsuarioController = require('../controlers/controlador');

// CONTROLADORES DE USUARIOS

Router.get('/listar', UsuarioController.getUsuarios);               
Router.get('/detalle/:id', UsuarioController.getUsuarioById);      
Router.delete('/eliminar/:id', UsuarioController.eliminarUsuario); 
Router.put('/editar/:id', UsuarioController.editarUsuario);

Router.post('/registro', UsuarioController.crearUsuario);         
Router.post('/login', UsuarioController.loginUsuario);            


Router.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = Router;