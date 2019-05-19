import { config as initializeDotEnv } from 'dotenv'
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from './models/user'
import auth from './middlewares/auth'

initializeDotEnv()

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

app.get('/users', auth, async (req, res) => {
  const users = await User.find()
  res.json(users)
})

app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign(
      { _id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.status(200).json({ token })
  }

  res.status(401).json({ error: { message: 'Wrong credentials' } })
})

app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  try {
    if (!user) {
      const newUser = new User()
      newUser.email = email
      newUser.password = await bcrypt.hash(password, 10)
      newUser.save()
      res.json({ user: { _id: newUser.id, email: newUser.email } })
    } else {
      res.status(401).json({ error: { message: 'User already exist' } })
    }
  } catch (err) {
    throw new Error(err)
  }
})

app.use((req, res, next) => res.status(404).json({ error: { message: 'Page not found' } }))
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong'
  })
})

mongoose
  .connect(process.env.MONGO_URL, { useCreateIndex: true, useNewUrlParser: true })
  .then(conn => {
    let listener = app.listen(process.env.PORT || 3000)
    console.log(`Listening on port ${listener.address().port}`)
  })
  .catch(err => { throw new Error(err) })
