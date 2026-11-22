const express = require('express')
const adminController = require('../controllers/admin.controller')
const newsController = require('../controllers/news.controller')
const router = express.Router()
const categorySchema = require('../validators/category.validator')
const tagSchema = require('../validators/tag.validator')
const validate = require('../middlewares/validate.middleware')
const rejectNewsSchema = require('../validators/rejectNews.validator')
const blockUserSchema = require('../validators/blockUser.validator')
const tagsController = require('../controllers/tags.controller')
const categoriesController = require('../controllers/categories.controller')

// GET REQUESTS
router.get('/stats', adminController.getStatistics)
router.get('/news', adminController.getNews)
router.get('/users', adminController.getUsersList)
router.get('/users/:id/news', adminController.getUsersNews)
router.get('/tags', tagsController.getTags)
router.get('/categories', categoriesController.getCategories)

// POST REQUESTS
router.post(
	'/categories',
	validate(categorySchema),
	adminController.createCategory,
)
router.post('/news', newsController.createNews)
router.post('/tags', validate(tagSchema), adminController.createTag)

// PATCH REQUESTS
router.patch('/news/:id/approve', adminController.approveNews)
router.patch(
	'/news/:id/reject',
	validate(rejectNewsSchema),
	adminController.rejectNews,
)
router.patch(
	'/users/:id/block',
	validate(blockUserSchema),
	adminController.blockUser,
)
router.patch('/users/:id/unblock', adminController.unblockUser)
router.patch(
	'/categories/:id',
	validate(categorySchema),
	adminController.updateCategory,
)
router.patch('/tags/:id', validate(tagSchema), adminController.updateTag)

// DELETE REQUESTS
router.delete('/categories/:id', adminController.deleteCategory)
router.delete('/tags/:id', adminController.deleteTag)

module.exports = router
