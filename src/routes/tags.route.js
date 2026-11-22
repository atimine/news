const express = require('express')
const tagsController = require('../controllers/tags.controller')
const router = express.Router()

// GET REQUEST
router.get('/', tagsController.getTags)
router.get('/:id', tagsController.getOneTag)

module.exports = router
