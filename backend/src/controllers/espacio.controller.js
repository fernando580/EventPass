const EspacioModel = require('../models/espacio.model');

const getEspacios = async (req, res) => {
  try {
    const espacios = await EspacioModel.getAll();
    res.status(200).json(espacios);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getEspacioById = async (req, res) => {
  try {
    const { id } = req.params;
    const espacio = await EspacioModel.getById(id);
    if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado' });
    res.status(200).json(espacio);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createEspacio = async (req, res) => {
  try {
    const { sede_id, nombre, capacidad } = req.body;
    if (!sede_id || !nombre || !capacidad) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const nuevoEspacio = await EspacioModel.create({ sede_id, nombre, capacidad });
    res.status(201).json(nuevoEspacio);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el espacio' });
  }
};

const updateEspacio = async (req, res) => {
  try {
    const { id } = req.params;
    const { sede_id, nombre, capacidad } = req.body;
    const espacioActualizado = await EspacioModel.update(id, { sede_id, nombre, capacidad });
    if (!espacioActualizado) return res.status(404).json({ error: 'Espacio no encontrado' });
    res.status(200).json(espacioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el espacio' });
  }
};

const deleteEspacio = async (req, res) => {
  try {
    const { id } = req.params;
    const espacioEliminado = await EspacioModel.delete(id);
    if (!espacioEliminado) return res.status(404).json({ error: 'Espacio no encontrado' });
    res.status(200).json({ mensaje: 'Espacio eliminado exitosamente', espacio: espacioEliminado });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el espacio' });
  }
};

module.exports = { getEspacios, getEspacioById, createEspacio, updateEspacio, deleteEspacio };