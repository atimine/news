require('dotenv').config()

// const dns = require('node:dns')
// dns.setServers(['8.8.8.8', '1.1.1.1'])

const express = require('express')
const authRouter = require('./routes/auth.route')
const newsRouter = require('./routes/news.route')
const categoriesRouter = require('./routes/categories.route')
const tagsRouter = require('./routes/tags.route')
const adminRoute = require('./routes/admin.route')
const cookieParser = require('cookie-parser')
const authenticateToken = require('./middlewares/authenticate.middleware')
const authorize = require('./middlewares/authorize.middleware')
const { connectDatabase } = require('./config/db')
const app = express()

const PORT = process.env.PORT

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// ROUTES
app.get('/', (req, res) => {
	console.log(req.cookies)
	res.status(200)
	res.json({ message: 'Welcome to News API' })
})
app.use('/api/news', newsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/auth', authRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/admin', authenticateToken, authorize, adminRoute)

async function boost() {
	app.listen(PORT, err => {
		if (err) {
			console.log(err)
		}
		console.log('Express App running on: ', PORT)
	})

	await connectDatabase()
}

boost()
