const express = require('express')
const authController = require('../controllers/auth.controller')
const authenticateToken = require('../middlewares/authenticate.middleware')
const checkBlocked = require('../middlewares/checkBlocked.middleware')
const validateSchema = require('../middlewares/validate.middleware')
const validate = require('../middlewares/validate.middleware')

const updateProfileSchema = require('../validators/updateProfile.validator')
const registerSchema = require('../validators/register.validator')
const loginSchema = require('../validators/login.validator')
const changingPasswordSchema = require('../validators/changingPassword.validator')
const rateLimiter = require('../middlewares/rateLimiter.middleware')

const router = express.Router()

// GET REQUESTS
router.get('/me', authenticateToken, authController.getCurrentUser)

// POST REQUESTS
router.post(
	'/register',
	rateLimiter,
	validateSchema(registerSchema),
	authController.register,
)
router.post(
	'/login',
	rateLimiter,
	validate(loginSchema),
	checkBlocked,
	authController.login,
)
router.post('/logout', authenticateToken, authController.logout)
router.post('/refresh', authController.refreshAccessToken)

// PATCH REQUESTS
router.patch(
	'/me',
	validate(updateProfileSchema),
	authenticateToken,
	authController.editProfile,
)
router.patch(
	'/change-password',
	validate(changingPasswordSchema),
	authenticateToken,
	authController.changePassword,
)
router.patch(
	'/forget-password',
	authenticateToken,
	authController.updatePassword,
)

module.exports = router
