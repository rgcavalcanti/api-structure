import {} from 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import morgan from 'morgan'

import userRoutes from './src/routes/users'

const app = express()

// Middlewares
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

// Routes
app.use('/users', userRoutes)

mongoose
  .connect(process.env.MONGO_URL, { useCreateIndex: true, useNewUrlParser: true })
  .then(conn => {
    let listener = app.listen(process.env.PORT || 3000)
    console.log(`Listening on port ${listener.address().port}`)
  })
  .catch(err => { throw new Error(err) })
