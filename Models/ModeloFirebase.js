const { admin, db }= require('../db/firebaseCredenciales');
const usuariosRef = db.collection('usuarios');
const tiendasRef = db.collection('Tienda');
const productosRef = db.collection('Producto');

class Usuario {
  static async create(data) {
    const newDoc = await usuariosRef.add(data);
    return { id: newDoc.id, ...data };
  }

  static async findByUsuario(usuario) {
    const snapshot = await usuariosRef.where('usuario', '==', usuario).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async getAll() {
    const snapshot = await usuariosRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await usuariosRef.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await usuariosRef.doc(id).update(data);
    return { id, ...data };
  }

  static async delete(id) {
    await usuariosRef.doc(id).delete();
    return { mensaje: 'Usuario eliminado', id };
  }
}

class TiendaModel {
  static async listarTiendas() {
    const snapshot = await tiendasRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async obtenerTiendaPorId(id) {
    const doc = await tiendasRef.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async crearTienda(data) {
    const ref = await tiendasRef.add(data);
    return { id: ref.id };
  }

  static async actualizarTienda(id, data) {
    await tiendasRef.doc(id).update(data);
  }

  static async eliminarTienda(id) {
    await tiendasRef.doc(id).delete();
  }
}

class ProductoModel {
  static async buscarPorNombre(nombre) {
    const snapshot = await productosRef
      .where('nombre', '>=', nombre)
      .where('nombre', '<=', nombre + '\uf8ff')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async listarTodos() {
    const snapshot = await productosRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async listarPorTienda(idTienda) {
    const snapshot = await productosRef.where('id_tienda', '==', idTienda).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async crearProducto(data) {
    const ref = await productosRef.add(data);
    return { id: ref.id };
  }

  static async actualizarProducto(id, data) {
    await productosRef.doc(id).update(data);
  }

  static async eliminarProducto(id) {
    await productosRef.doc(id).delete();
  }
}

module.exports = {Usuario, TiendaModel, ProductoModel};
