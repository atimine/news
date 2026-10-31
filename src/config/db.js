const mongoose = require('mongoose')

const db_uri = process.env.MONGODB_URI

async function connectDatabase() {
	try {
		await mongoose.connect(db_uri)
		console.log('DB connected')
	} catch (error) {
		console.log('Error while db connection: ', error)
	}
}

module.exports = { connectDatabase, mongoose }
