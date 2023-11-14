// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuthentication } = require('../middlewares/authMiddleware');

router.get('/users',   adminController.getUsers);
router.get('/user/:id',  ensureAuthentication, adminController.getUserById);
router.post('/update-role', ensureAuthentication, adminController.updateUserRole);

module.exports = router;