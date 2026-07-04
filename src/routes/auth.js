const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshAccessToken,
  requestPasswordReset,
  resetPassword,
  logout,
  getCurrentUser,
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authenticate');
const {
  registerRules,
  loginRules,
  passwordResetRules,
  handleValidationErrors,
} = require('../validators/authValidator');

// Public routes
router.post('/register', registerRules(), handleValidationErrors, register);
router.post('/login', loginRules(), handleValidationErrors, login);
router.post('/refresh', refreshAccessToken);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', passwordResetRules(), handleValidationErrors, resetPassword);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
