import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  try {
    req.user = jwt.verify(req.headers['authorization'], process.env.JWT_SECRET)
  } catch (err) {
    return res.status(401).json({
      error: {
        message: 'Failed to authenticate token!'
      }
    })
  }
  next()
}
