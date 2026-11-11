const express = require('express')
const newsController = require('../controllers/news.controller')
const authenticateToken = require('../middlewares/authenticate.middleware')
const isOwnerOrAdmin = require('../middlewares/isOwnerOrAdmin.middleware')
const uploadMiddleware = require('../middlewares/upload.middleware')
const validateMiddleware = require('../middlewares/validate.middleware')
const router = express.Router()

// GET REQUESTS
router.get('/', newsController.renderNews)
router.get('/search', newsController.searchNews)
router.get('/my', authenticateToken, newsController.getMyNews)
router.get('/:slug', newsController.getOneNews)

// POST REQUEST
router.post(
	'/',
	authenticateToken,
	validateMiddleware.checkCreatingNewsSchema,
	uploadMiddleware,
	newsController.createNews,
)

// PATCH REQUESTS
router.patch(
	'/:id',
	authenticateToken,
	isOwnerOrAdmin,
	validateMiddleware.checkUpdatingNewsSchema,
	newsController.editNews,
)

// DELETE REQUESTS
router.delete(
	'/:id',
	authenticateToken,
	isOwnerOrAdmin,
	newsController.deleteNews,
)

module.exports = router
