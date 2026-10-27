const express = require('express')
const authController = require('../controllers/auth.controller')
const authenticateToken = require('../middlewares/authenticate.middleware')
const router = express.Router()

// GET REQUESTS
router.get('/me', authenticateToken, authController.getCurrentUser)

// POST REQUESTS
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authenticateToken, authController.logout)
router.post('/refresh', authController.refreshAccessToken)

// PATCH REQUESTS
router.patch('/me', authenticateToken, authController.editProfile)
router.patch(
	'/change-password',
	authenticateToken,
	authController.changePassword,
)
router.patch('/forget-password', authController.updatePassword)

module.exports = router
