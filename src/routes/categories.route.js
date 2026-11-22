const express = require('express')
const router = express.Router()
const categoriesController = require('../controllers/categories.controller')

// GET REQUESTS
router.get('/', categoriesController.getCategories)
router.get('/:id', categoriesController.getOneCategory)

module.exports = router
