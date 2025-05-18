import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'

const app = express()
connectDB()

app.use(cors(corsConfig))
app.options('*', cors(corsConfig))
app.use(express.json())
app.use('/', router)

export default app
