require('dotenv').config()

const express = require('express')
const connectionDB = require('./config/db')
const authRouter = require('./routes/auth.route')
const newsRouter = require('./routes/news.route')
const categoriesRouter = require('./routes/categories.route')
const tagsRouter = require('./routes/tags.route')
const adminRoute = require('./routes/admin.route')
const setDefaultAdmin = require('./seeds/admin.seed')
const cookieParser = require('cookie-parser')
const authenticateToken = require('./middlewares/authenticate.middleware')
const { customAlphabet } = require('nanoid')
const authorize = require('./middlewares/authorize.middleware')
const app = express()

const PORT = process.env.PORT

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// ROUTES
app.get('/', (req, res) => {
	res.status(200)
	res.json({ message: 'Welcome to News API' })
})
app.use('/api/news', newsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/auth', authRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/admin', authenticateToken, authorize, adminRoute)

connectionDB().then(() => {
	app.listen(PORT, err => {
		if (err) {
			console.log(err)
		}

		// Please provide admin privilages in the env file before running the application
		setDefaultAdmin(
			process.env.ADMIN_NAME,
			process.env.ADMIN_EMAIL,
			process.env.USER_ROLE,
			process.env.ADMIN_PASSWORD,
		)
		console.log('Express App running on: ', PORT)
	})
})
