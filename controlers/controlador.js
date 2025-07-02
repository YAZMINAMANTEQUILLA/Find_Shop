const pool = require("../db/conection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

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
  const { nombre, usuario } = req.body;
  if (!nombre || !usuario) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  pool.query(
    'UPDATE usuarios SET nombre = ?, usuario = ? WHERE id = ?',
    [nombre, usuario, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario actualizado correctamente' });
    }
  );
}

}

module.exports = new UsuarioController();
