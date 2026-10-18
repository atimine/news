const mongoose = require('mongoose')
const { Schema } = mongoose

const News = new Schema({
	title: { type: String, required: true, minLength: 5, maxLength: 200 },
	description: { type: String, required: true },
	slug: { type: String, unique: true },
	// images: {type: Array }
	// category: {}
})
