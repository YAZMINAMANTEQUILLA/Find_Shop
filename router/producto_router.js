const express = require('express');
const Router = express.Router();
const {ProductoModel} = require('../controlers/controlador');


// RUTAS DE PRODUCTOS
Router.get('/listar', ProductoModel.listar);
Router.get('/obtener/:id', ProductoModel.obtenerPorId);
Router.post('/crear', ProductoModel.crear);
Router.put('/editar/:id', ProductoModel.actualizar);
Router.delete('/eliminar/:id', ProductoModel.eliminar);

module.exports = Router;