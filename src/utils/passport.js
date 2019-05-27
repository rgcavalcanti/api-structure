import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

import User from '../models/user'

// JSON Web Token Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)

    if (!user) return done(null, false)

    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))

// Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email })

    if (!user) return done(null, false)

    const isValidPassword = await user.isValidPassword(password)

    if (!isValidPassword) return done(null, false)

    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))

export default {
  local: passport.authenticate('local', { session: false }),
  jwt: passport.authenticate('jwt', { session: false })
}
