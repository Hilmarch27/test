const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthentication} = require('../middlewares/authMiddleware');

router.get('/kecamatan',  userController.renderKecamatanPage);
router.get('/profile', ensureAuthentication, ensureKecamatan, userController.renderProfile);
module.exports = router;