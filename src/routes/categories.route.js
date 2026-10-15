const express = require('express')
const categoriesController = require('../controllers/categories.controller')
const router = express.Router()

// GET REQUESTS
router.get('/', categoriesController.renderCategories)

module.exports = router
