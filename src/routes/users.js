import { Router } from 'express'
import { body, validationResult } from 'express-validator/check'
import auth from '../utils/passport'

import userRoutes from '../controllers/users'

const router = Router()

router.post(
  '/signup', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    next()
  },
  userRoutes.signUp
)
router.post('/signin', auth.local, userRoutes.signIn)
router.get('/secret', auth.jwt, userRoutes.secret)

export default router
