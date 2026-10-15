const express = require('express')
const authController = require('../controllers/auth.controller')
const router = express.Router()

// GET REQUESTS
router.get('/', authController.renderNews)
router.get('/me', authController.getCurrentUser)

// POST REQUESTS
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/refresh', authController.refreshCookie)

// PATCH REQUESTS
router.patch('/me', authController.editProfile)
router.patch('/change-password', authController.changePassword)

module.exports = router
