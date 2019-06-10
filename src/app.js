import { } from 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import morgan from 'morgan'

import userRoutes from './routes/users'

const app = express()

// Middlewares
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

// Routes
app.use('/users', userRoutes)

export default app
