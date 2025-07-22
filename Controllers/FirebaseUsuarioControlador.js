require('dotenv').config();
const jwt = require('jsonwebtoken');
const Usuario = require('../Models/ModeloFirebase');
const bcrypt = require('bcrypt');

const SECRET = process.env.JWT_SECRET;
const crypto = require('crypto');
// REGISTRAR USUARIO
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, usuario, clave } = req.body;

    const hashed = await bcrypt.hash(clave, 10);
    const api_key = crypto.randomBytes(16).toString('hex');

    const nuevoUsuario = await Usuario.create({ nombre, usuario, clave: hashed, api_key });
    res.status(201).json({ mensaje: 'Usuario registrado', usuario: nuevoUsuario });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// LOGIN
exports.loginUsuario = async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
      return res.status(400).json({ mensaje: 'Usuario y clave son requeridos' });
    }

    const usuarioDB = await Usuario.findByUsuario(usuario);
    if (!usuarioDB) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const valido = await bcrypt.compare(clave, usuarioDB.clave);
    if (!valido) {
      return res.status(401).json({ mensaje: 'Clave incorrecta' });
    }

    const token = jwt.sign(
      { id: usuarioDB.id, usuario: usuarioDB.usuario },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuarioDB.id,
        nombre: usuarioDB.nombre,
        usuario: usuarioDB.usuario,
        api_key: usuarioDB.api_key,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en login' });
  }
};

// LISTAR TODOS LOS USUARIOS
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// OBTENER USUARIO POR ID
exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.getById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// ACTUALIZAR USUARIO
exports.editarUsuario = async (req, res) => {
  try {
    const { clave, ...resto } = req.body;
    let datosActualizados = { ...resto };

    if (clave) {
      datosActualizados.clave = await bcrypt.hash(clave, 10);
    }

    const actualizado = await Usuario.update(req.params.id, datosActualizados);
    res.json({ mensaje: 'Usuario actualizado', usuario: actualizado });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// ELIMINAR USUARIO
exports.eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await Usuario.delete(req.params.id);
    res.json({ mensaje: 'Usuario eliminado', eliminado });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
