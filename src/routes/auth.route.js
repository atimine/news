const express = require('express')
const authController = require('../controllers/auth.controller')
const authenticateToken = require('../middlewares/authenticate.middleware')
const checkBlocked = require('../middlewares/checkBlocked.middleware')
const validateMiddleware = require('../middlewares/validate.middleware')
const router = express.Router()

// GET REQUESTS
router.get('/me', authenticateToken, authController.getCurrentUser)

// POST REQUESTS
router.post(
	'/register',
	validateMiddleware.checkRegister,
	authController.register,
)
router.post(
	'/login',
	// validateMiddleware.checkLogin,
	checkBlocked,
	authController.login,
)
router.post('/logout', authenticateToken, authController.logout)
router.post('/refresh', authController.refreshAccessToken)

// PATCH REQUESTS
router.patch(
	'/me',
	validateMiddleware.checkUpdateProfile,
	authenticateToken,
	authController.editProfile,
)
router.patch(
	'/change-password',
	validateMiddleware.checkChangingPassword,
	authenticateToken,
	authController.changePassword,
)
router.patch(
	'/forget-password',
	authenticateToken,
	authController.updatePassword,
)

module.exports = router
