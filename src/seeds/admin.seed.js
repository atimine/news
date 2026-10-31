require('dotenv').config()
const { connectDatabase, mongoose } = require('../config/db')
const usersModel = require('../models/users.model')
const bcrypt = require('bcrypt')

async function setDefaultAdmin() {
	const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)

	const defaultAdmin = await usersModel.findOne({
		email: process.env.ADMIN_EMAIL,
	})

	if (!defaultAdmin) {
		console.log('Default admin was created!')
		return await usersModel.create({
			name: process.env.ADMIN_NAME,
			email: process.env.ADMIN_EMAIL,
			password,
			role: process.env.USER_ROLE,
		})
	}

	console.log('Default admin is active')
}

connectDatabase().then(async () => {
	await setDefaultAdmin()
	mongoose.connection.close()
})
