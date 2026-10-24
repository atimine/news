const express = require('express')
const adminController = require('../controllers/admin.controller')
const authenticateToken = require('../middlewares/authenticate.middleware')
const router = express.Router()

// GET REQUESTS
router.get('/stats', authenticateToken, adminController.renderStatistics)
router.get('/news', authenticateToken, adminController.renderNews)
router.get('/users', adminController.renderUsersList)
router.get('/users/:id/news', adminController.renderUsersNews)

// POST REQUESTS
router.post('/categories', adminController.createCategory)
router.post('/tags', adminController.createTag)

// PATCH REQUESTS
router.patch('/news/:id/approve', adminController.renderNews)
router.patch('/news/:id/approve', adminController.renderNews)
router.patch('/users/:id/block', adminController.blockUser)
router.patch('/users/:id/unblock', adminController.unblockUser)
router.patch('/categories/:id', adminController.updateCategory)
router.patch('/tags/:id', adminController.updateTag)

// DELETE REQUESTS
router.delete('/categories/:id', adminController.deleteCategory)
router.delete('/tags/:id', adminController.deleteTag)

module.exports = router
