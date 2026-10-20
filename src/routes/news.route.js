const express = require('express')
const newsController = require('../controllers/news.controller')
const router = express.Router()

// GET REQUESTS
router.get('/', newsController.renderNews)
router.get('/search', newsController.searchNews)
router.get('/my', newsController.getMyNews)
router.get(':slug', newsController.getOneNews)

// POST REQUEST
router.post('/', newsController.createNews)

// PATCH REQUESTS
router.patch('/:id', newsController.editNews)

// DELETE REQUESTS
router.delete('/:id', newsController.deleteNews)

module.exports = router
