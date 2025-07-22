const express = require('express');
const Router = express.Router();
const {ProductoModel} = require('../Models/Modelo');


// RUTAS DE PRODUCTOS
Router.get('/listar', ProductoModel.listar);
Router.get('/obtener/:id', ProductoModel.obtenerPorId);
Router.post('/crear', ProductoModel.crear);
Router.put('/editar/:id', ProductoModel.actualizar);
Router.delete('/eliminar/:id', ProductoModel.eliminar);
Router.get('/buscar/:nombre', ProductoModel.buscarProducto);


module.exports = Router;