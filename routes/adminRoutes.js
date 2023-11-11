// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAdmin, ensureAuthentication } = require('../middlewares/authMiddleware');

router.get('/users', ensureAuthentication, ensureAdmin, adminController.getUsers);
router.get('/user/:id', ensureAdmin, adminController.getUserById);
router.post('/update-role', ensureAdmin, adminController.updateUserRole);

module.exports = router;