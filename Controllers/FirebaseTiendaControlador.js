const {TiendaModel} = require("../Models/ModeloFirebase");

class TiendaController {
  static async crear(req, res) {
    try {
      const datos = req.body;

      console.log("🟢 Datos recibidos:", datos); // <-- Asegura que llegan los datos

      await TiendaModel.crearTienda(datos);

      res
        .status(201)
        .json({ mensaje: "Tienda creada correctamente", tienda: datos });
    } catch (error) {
      console.error("🔥 Error exacto al crear tienda:", error); // <-- Aquí verás el error real

      res.status(500).json({
        error: "Error al crear la tienda",
        detalles: error.message, 
      });
    }
  }

  static async listar(req, res) {
    try {
      const tiendas = await TiendaModel.listarTiendas();
      res.status(200).json(tiendas);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener tiendas" });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const tienda = await TiendaModel.obtenerTiendaPorId(req.params.id);
      res.status(200).json(tienda);
    } catch (error) {
      res.status(404).json({ error: "Tienda no encontrada" });
    }
  }

  static async actualizar(req, res) {
    try {
      await TiendaModel.actualizarTienda(req.params.id, req.body);
      res.status(200).json({ message: "Tienda actualizada" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la tienda" });
    }
  }

  static async eliminar(req, res) {
    try {
      await TiendaModel.eliminarTienda(req.params.id);
      res.status(200).json({ message: "Tienda eliminada" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la tienda" });
    }
  }
}

module.exports = TiendaController;
