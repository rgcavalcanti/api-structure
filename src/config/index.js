import { } from 'dotenv/config'
import devConfig from './development'
import prodConfig from './production'
import testConfig from './test'

const env = process.env.NODE_ENV
let config = devConfig

if (env === 'production') config = prodConfig
if (env === 'test') config = testConfig

export default config
