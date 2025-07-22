const express = require('express');
const Router = express.Router();
const usuarioController = require('../Controllers/FirebaseUsuarioControlador');
const verificarToken = require('../middlewares/authMiddleware');

// Rutas públicas
Router.post('/registro', usuarioController.crearUsuario);
Router.post('/login', usuarioController.loginUsuario);

// Rutas protegidas
Router.get('/listar', verificarToken, usuarioController.getUsuarios);
Router.get('/detalle/:id', verificarToken, usuarioController.getUsuarioById);
Router.put('/editar/:id', verificarToken, usuarioController.editarUsuario);
Router.delete('/eliminar/:id', verificarToken, usuarioController.eliminarUsuario);

module.exports = Router;
