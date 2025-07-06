const pool = require("../db/conection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// CLASE USUARIO
class UsuarioController {
  async getUsuarios(req, res) {
    try {
      const result = await pool.query(
        "SELECT * FROM usuarios",
        (err, respuesta) => {
          if (err) {
            console.error("Error al obtener los usuarios:", err);
            return res
              .status(500)
              .json({ error: "Error al obtener los usuarios" });
          }
          res.json(respuesta);
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUsuarioById(req, res) {
    const { id } = req.params;
    pool.query(
      "SELECT id, nombre, usuario FROM usuarios WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(results[0]);
      }
    );
  }

  async crearUsuario(req, res) {
    try {
      const { nombre, usuario, clave } = req.body;
      const hash = await bcrypt.hash(clave, 10);
      const apiKey = uuidv4().replace(/-/g, "").slice(0, 15);

      const result = await pool.query(
        "INSERT INTO usuarios (nombre, usuario, clave, api_key) VALUES (?, ?, ?,?)",
        [nombre, usuario, hash, apiKey]
      );

      res.status(201).json({ mensaje: "Usuario registrado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  loginUsuario(req, res) {
    const { usuario, clave } = req.body;

    pool.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [usuario],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const user = results[0];

        const valid = await bcrypt.compare(clave, user.clave);
        if (!valid) {
          return res.status(401).json({ error: "Clave incorrecta" });
        }

        const token = jwt.sign(
          { id: user.id, usuario: user.usuario },
          process.env.JWT_SECRET || "secreto",
          { expiresIn: "8h" }
        );

        res.json({
          id: user.id,
          nombre: user.nombre,
          usuario: user.usuario,
          token,
        });
      }
    );
  }

  eliminarUsuario(req, res) {
    const { id } = req.params;
    pool.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({ message: "Usuario eliminado correctamente" });
    });
  }

  editarUsuario(req, res) {
    const { id } = req.params;
    const { nombre, usuario, clave } = req.body;

    if (!nombre || !usuario || !clave) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Encriptar la clave con callback
    bcrypt.hash(clave, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Error al encriptar la clave" });
      }

      pool.query(
        "UPDATE usuarios SET nombre = ?, clave = ?, usuario = ? WHERE id = ?",
        [nombre, hash, usuario, id],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
          }
          res.json({ message: "Usuario actualizado correctamente" });
        }
      );
    });
  }
}

// CLASE TIENDA

class TiendaModel {
  static listar(req, res) {
    const sql = "SELECT * FROM Tienda";
    pool.query(sql, (err, results) => {
      if (err)
        return res.status(500).json({ error: "Error al obtener tiendas" });
      res.status(200).json(results);
    });
  }
  static obtenerPorId(req, res) {
    const { id } = req.params;
    const sql = "SELECT * FROM Tienda WHERE id = ?";
    pool.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ error: "Error al buscar tienda" });
      if (results.length === 0)
        return res.status(404).json({ message: "Tienda no encontrada" });
      res.status(200).json(results[0]);
    });
  }

  static crear(req, res) {
    const {
      nombre_tienda,
      nombre_usuario,
      Descripcion,
      Categoria,
      estado,
      ubicacion,
      latitud,
      longitud,
    } = req.body;

    const sql = `
      INSERT INTO Tienda 
      (nombre_tienda, nombre_usuario, Descripcion, Categoria, estado, ubicacion, latitud, longitud) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      sql,
      [
        nombre_tienda,
        nombre_usuario,
        Descripcion,
        Categoria,
        estado,
        ubicacion,
        latitud,
        longitud,
      ],
      (err, result) => {
        if (err)
          return res.status(500).json({ error: "Error al crear tienda" });
        res.status(201).json({ message: "Tienda creada", id: result.insertId });
      }
    );
  }

  static actualizar(req, res) {
    const { id } = req.params;
    const data = req.body;

    const sql = "UPDATE Tienda SET ? WHERE id = ?";
    pool.query(sql, [data, id], (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al actualizar tienda" });
      res.status(200).json({ message: "Tienda actualizada correctamente" });
    });
  }

  static eliminar(req, res) {
    const { id } = req.params;
    const sql = "DELETE FROM Tienda WHERE id = ?";
    pool.query(sql, [id], (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al eliminar tienda" });
      res.status(200).json({ message: "Tienda eliminada" });
    });
  }
}

// CLASE PRODUCTO

class ProductoModel {
  static buscarProducto(req, res) {
  const { nombre } = req.params;
  const sql = "SELECT * FROM Producto WHERE nombre LIKE ?";
  pool.query(sql, [`%${nombre}%`], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al buscar productos" });
    if (results.length === 0)
      return res.status(404).json({ message: "No se encontraron productos" });
    res.status(200).json(results); // importante: devolver como array
  });
}


  static listar(req, res) {
    const sql = "SELECT * FROM Producto";
    pool.query(sql, (err, results) => {
      if (err)
        return res.status(500).json({ error: "Error al obtener productos" });
      res.status(200).json(results);
    });
  }

  static obtenerPorId(req, res) {
    const { id } = req.params;
    const sql = "SELECT * FROM Producto WHERE id_tienda = ?";
    pool.query(sql, [id], (err, results) => {
      if (err)
        return res.status(500).json({ error: "Error al buscar producto" });

      // ✅ Devuelve SIEMPRE una lista (aunque esté vacía)
      res.status(200).json(results);
    });
  }

  static crear(req, res) {
    const { id_tienda, nombre, descripcion, id_usuario, img, fecha } = req.body;

    const sql = `
      INSERT INTO Producto 
      (id_tienda, nombre, descripcion, id_usuario, img, fecha) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      sql,
      [id_tienda, nombre, descripcion, id_usuario, img, fecha],
      (err, result) => {
        if (err)
          return res.status(500).json({ error: "Error al crear producto" });
        res
          .status(201)
          .json({ message: "Producto creado", id: result.insertId });
      }
    );
  }

  static actualizar(req, res) {
    const { id } = req.params;
    const data = req.body;

    const sql = "UPDATE Producto SET ? WHERE id_producto = ?";
    pool.query(sql, [data, id], (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al actualizar producto" });
      res.status(200).json({ message: "Producto actualizado correctamente" });
    });
  }

  static eliminar(req, res) {
    const { id } = req.params;
    const sql = "DELETE FROM Producto WHERE id_producto = ?";
    pool.query(sql, [id], (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al eliminar producto" });
      res.status(200).json({ message: "Producto eliminado" });
    });
  }
}

module.exports = {
  TiendaModel: TiendaModel,
  UsuarioController: UsuarioController,
  ProductoModel: ProductoModel,
};
