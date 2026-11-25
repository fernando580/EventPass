const RolModel = require('../models/rol.model');

const getRoles = async (req, res) => {
  try {
    const roles = await RolModel.getAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
};

const getRolById = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await RolModel.getById(id);
    if (!rol) return res.status(404).json({ error: 'Rol no encontrado' });
    res.status(200).json(rol);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createRol = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
    const nuevoRol = await RolModel.create({ nombre });
    res.status(201).json(nuevoRol);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el rol' });
  }
};

const updateRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
    const rolActualizado = await RolModel.update(id, { nombre });
    if (!rolActualizado) return res.status(404).json({ error: 'Rol no encontrado para actualizar' });
    res.status(200).json(rolActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el rol' });
  }
};

const deleteRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rolEliminado = await RolModel.delete(id);
    if (!rolEliminado) return res.status(404).json({ error: 'Rol no encontrado para eliminar' });
    res.status(200).json({ mensaje: 'Rol eliminado exitosamente', rol: rolEliminado });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el rol' });
  }
};

module.exports = { getRoles, getRolById, createRol, updateRol, deleteRol };