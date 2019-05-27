import jwt from 'jsonwebtoken'
import User from '../models/user'

const signToken = user => {
  return jwt.sign({
    iss: 'Basic Api',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, process.env.JWT_SECRET, {})
}

export default {
  signUp: async (req, res, next) => {
    try {
      const { email, password } = req.body

      const foundUser = await User.findOne({ email })

      console.log(foundUser)
      if (foundUser) {
        return res.status(404).json({ error: 'Email is already in use' })
      }

      const newUser = new User({ email, password })
      await newUser.save()

      const token = signToken(newUser)

      res.status(200).json({ token })
    } catch (error) {
      next(error)
    }
  },
  signIn: (req, res, next) => {
    const token = signToken(req.user)
    res.status(200).json({ token })
  },
  secret: async (req, res, next) => { res.json({ secret: 'super secret' }) }
}
