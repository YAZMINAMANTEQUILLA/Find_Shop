const express = require('express');
const Router = express.Router();
const {TiendaModel} = require('../controlers/controlador');

// RUTAS DE USUARIOS


Router.get("/listar", TiendaModel.listar);
Router.get("/obtener/:id", TiendaModel.obtenerPorId);
Router.post("/crear", TiendaModel.crear);
Router.put("/editar/:id", TiendaModel.actualizar);
Router.delete("/eliminar/:id", TiendaModel.eliminar);


module.exports = Router;