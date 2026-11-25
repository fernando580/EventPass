const CategoriaModel = require('../models/categoria.model');

const getCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaModel.getAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaModel.getById(id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
    const nuevaCategoria = await CategoriaModel.create({ nombre });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
    const categoriaActualizada = await CategoriaModel.update(id, { nombre });
    if (!categoriaActualizada) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.status(200).json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoriaEliminada = await CategoriaModel.delete(id);
    if (!categoriaEliminada) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.status(200).json({ mensaje: 'Categoría eliminada exitosamente', categoria: categoriaEliminada });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};

module.exports = { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };