const { Router } = require('express');
const router = Router();
const { getSedes, getSedeById, createSede, updateSede, deleteSede } = require('../controllers/sede.controller');

router.get('/', getSedes);
router.get('/:id', getSedeById);
router.post('/', createSede);
router.put('/:id', updateSede);
router.delete('/:id', deleteSede);

module.exports = router;