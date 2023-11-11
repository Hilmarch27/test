// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuthentication } = require('../middlewares/authMiddleware');

router.get('/login', authController.renderLoginPage);
router.get('/register', authController.renderRegisterPage);
router.post('/login',  authController.processLogin);
router.post('/register', authController.processRegistration);
router.get('/logout', ensureAuthentication, authController.logout);

module.exports = router;