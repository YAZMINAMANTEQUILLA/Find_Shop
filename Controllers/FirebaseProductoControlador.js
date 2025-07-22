const { ProductoModel } = require("../Models/ModeloFirebase");
const { v4: uuidv4 } = require("uuid");

class ProductoController {
  static async listar(req, res) {
    try {
      const productos = await ProductoModel.listarTodos();
      res.json({ ok: true, productos });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "Error al listar productos",
        error: error.message,
      });
    }
  }

  static async obtener(req, res) {
    try {
      const { id } = req.params;
      const producto = await ProductoModel.obtenerPorId(id);
      if (!producto)
        return res
          .status(404)
          .json({ ok: false, mensaje: "Producto no encontrado" });
      res.json({ ok: true, producto });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "Error al obtener producto",
        error: error.message,
      });
    }
  }

  static async crear(req, res) {
    try {
      const data = req.body;

      // Generar UUID y asignarlo como id_producto
      data.id_producto = uuidv4();

      const nuevo = await ProductoModel.crearProducto(data);

      res.status(201).json({
        ok: true,
        mensaje: "Producto creado correctamente",
        id: nuevo.id_producto, // Devolver el UUID como id
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "Error al crear producto",
        error: error.message,
      });
    }
  }

  static async editar(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!id || !data || typeof data !== "object") {
        return res.status(400).json({
          ok: false,
          mensaje: "ID o datos inválidos para la actualización",
        });
      }

      await ProductoModel.actualizarProducto(id, data);

      res.json({
        ok: true,
        mensaje: "Producto actualizado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "Error al actualizar producto",
        error: error.message,
      });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      await ProductoModel.eliminarProducto(id);
      res.json({ ok: true, mensaje: "Producto eliminado correctamente" });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "Error al eliminar producto",
        error: error.message,
      });
    }
  }

  static async buscar(req, res) {
    try {
      const { nombre } = req.params;
      const resultados = await ProductoModel.buscarPorNombre(nombre);
      res.json({ ok: true, productos: resultados });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "Error al buscar productos",
        error: error.message,
      });
    }
  }

  static async listarPorTienda(req, res) {
    try {
      var { idTienda } = req.params;
      idTienda = Number(idTienda);
      const productos = await ProductoModel.listarPorTienda(idTienda);
      res.json({ ok: true, productos });
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: "Error al listar productos por tienda",
        error: error.message,
      });
    }
  }
}

module.exports = ProductoController;
