const express = require('express')
const tagsController = require('../controllers/tags.controller')
const router = express.Router()

// GET REQUEST
router.get('/', tagsController.renderTags)
router.get('/:id', tagsController.getOneTag)

module.exports = router
