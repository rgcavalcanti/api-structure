import mongoose from 'mongoose'
import config from '../config/index'

const connect = (app) => {
  mongoose
    .connect(config.MONGO_URL, { useCreateIndex: true, useNewUrlParser: true })
    .then(conn => {
      let listener = app.listen(config.PORT || 3000)
      console.log(`Listening on port ${listener.address().port}`)
      console.log(process.env.NODE_ENV)
    })
    .catch(err => { throw new Error(err) })
}

export default { connect }
