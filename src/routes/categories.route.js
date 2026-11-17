const express = require('express')
const router = express.Router()
const categoriesController = require('../controllers/categories.controller')
const isAdmin = require('../middlewares/isAdmin.middeware')

// GET REQUESTS
router.get('/', isAdmin, categoriesController.renderCategories)
router.get('/:id', categoriesController.getOneCategory)

module.exports = router
