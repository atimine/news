const mongoose = require('mongoose')
const { Schema } = mongoose

const Images = new Schema({
	url: String,
	filename: String,
	mimetype: String,
	size: String,
})

module.exports = Images
