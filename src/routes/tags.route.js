const express = require('express')
const tagsController = require('../controllers/tags.controller')
const isAdmin = require('../middlewares/isAdmin.middeware')
const router = express.Router()

// GET REQUEST
router.get('/', isAdmin, tagsController.renderTags)
router.get('/:id', tagsController.getOneTag)

module.exports = router
