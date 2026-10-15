const express = require('express')
const tagsController = require('../controllers/tags.controller')
const router = express.Router()

// GET REQUEST
router.get('/', tagsController.renderTags)

module.exports = router
