const SedeModel = require('../models/sede.model');

const getSedes = async (req, res) => {
  try {
    const sedes = await SedeModel.getAll();
    res.status(200).json(sedes);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
};

const getSedeById = async (req, res) => {
  try {
    const { id } = req.params;
    const sede = await SedeModel.getById(id);
    if (!sede) return res.status(404).json({ error: 'Sede no encontrada' });
    res.status(200).json(sede);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createSede = async (req, res) => {
  try {
    const { nombre, direccion, ciudad, capacidad_total } = req.body;
    if (!nombre || !direccion || !ciudad || !capacidad_total) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const nuevaSede = await SedeModel.create({ nombre, direccion, ciudad, capacidad_total });
    res.status(201).json(nuevaSede);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la sede', detalle: error.message });
  }
};

const updateSede = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, ciudad, capacidad_total } = req.body;
    const sedeActualizada = await SedeModel.update(id, { nombre, direccion, ciudad, capacidad_total });
    if (!sedeActualizada) return res.status(404).json({ error: 'Sede no encontrada para actualizar' });
    res.status(200).json(sedeActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la sede' });
  }
};

const deleteSede = async (req, res) => {
  try {
    const { id } = req.params;
    const sedeEliminada = await SedeModel.delete(id);
    if (!sedeEliminada) return res.status(404).json({ error: 'Sede no encontrada para eliminar' });
    res.status(200).json({ mensaje: 'Sede eliminada exitosamente', sede: sedeEliminada });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la sede' });
  }
};

module.exports = { getSedes, getSedeById, createSede, updateSede, deleteSede };