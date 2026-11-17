const mongoose = require('mongoose')
const { Schema } = mongoose

const Tags = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		minLength: 2,
		maxLength: 30,
	},
	slug: { type: String, unique: true },
	news_tags: { type: mongoose.Schema.Types.ObjectId, ref: 'News' },
})

module.exports = new mongoose.model('Tags', Tags)
