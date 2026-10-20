const express = require('express')
const router = express.Router()
const categoriesController = require('../controllers/categories.controller')

// GET REQUESTS
router.get('/', categoriesController.renderCategories)

module.exports = router
