const express = require("express");
const Router = express.Router();
const TiendaController = require("../Controllers/FirebaseTiendaControlador");
const verificarToken = require("../middlewares/authMiddleware");

// RUTAS DE TIENDAS
Router.get("/listar", verificarToken,TiendaController.listar);
Router.get("/obtener/:id",verificarToken ,TiendaController.obtenerPorId);
Router.post("/crear", verificarToken ,TiendaController.crear);
Router.put("/editar/:id",verificarToken ,TiendaController.actualizar);
Router.delete("/eliminar/:id", verificarToken,TiendaController.eliminar);

module.exports = Router;
