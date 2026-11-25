const { Router } = require('express');
const router = Router();
const { getEspacios, getEspacioById, createEspacio, updateEspacio, deleteEspacio } = require('../controllers/espacio.controller');

router.get('/', getEspacios);
router.get('/:id', getEspacioById);
router.post('/', createEspacio);
router.put('/:id', updateEspacio);
router.delete('/:id', deleteEspacio);

module.exports = router;