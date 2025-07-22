
const express = require('express');
const Router = express.Router();
const ProductoController = require('../Controllers/FirebaseProductoControlador');


Router.get('/buscar/:nombre', ProductoController.buscar);

Router.get('/listar', ProductoController.listar);
Router.get('/obtener/:idTienda', ProductoController.listarPorTienda);
Router.post('/crear', ProductoController.crear);
Router.put('/editar/:id', ProductoController.editar);
Router.delete('/eliminar/:id', ProductoController.eliminar);


module.exports = Router;