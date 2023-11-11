const express = require('express');
const router = express.Router();
const petugasController = require('../controllers/petugasController');
const {ensurePetugas } = require('../middlewares/authMiddleware');

router.get('/users',  petugasController.renderPetugasPage);

module.exports = router;