const express = require('express')
const newsController = require('../controllers/news.controller')
const authenticateToken = require('../middlewares/authenticate.middleware')
const isOwnerOrAdmin = require('../middlewares/isOwnerOrAdmin.middleware')
const router = express.Router()

// GET REQUESTS
router.get('/', newsController.renderNews)
router.get('/search', newsController.searchNews)
router.get('/my', authenticateToken, newsController.getMyNews)
router.get('/:slug', newsController.getOneNews)

// POST REQUEST
router.post('/', authenticateToken, newsController.createNews)

// PATCH REQUESTS
router.patch('/:id', authenticateToken, isOwnerOrAdmin, newsController.editNews)

// DELETE REQUESTS
router.delete('/:id', newsController.deleteNews)

module.exports = router
