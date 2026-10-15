const db = require('mongoose')

const db_uri = process.env.MONGODB_URI

async function connectionDB() {
	try {
		await db.connect(db_uri)
		console.log('DB connected')
	} catch (error) {
		console.log('Something went wrong; ', error)
	}
}

module.exports = connectionDB
