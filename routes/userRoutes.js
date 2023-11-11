const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthentication} = require('../middlewares/authMiddleware');

router.get('/profile', ensureAuthentication, userController.renderProfile);

// Rute tambahan berdasarkan peran
router.get('/kecamatan', ensureAuthentication, userController.renderKecamatanPage);

module.exports = router;