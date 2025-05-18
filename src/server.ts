// const express = require('express')
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'
connectDB()
const app = express()

const allowedOrigins = ['https://lendei.netlify.app', 'http://localhost:5173'];

app.use(cors(corsConfig))
/** Leer datos de formulario **/ 
app.use(express.json())
app.use('/', router)

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('No permitido por CORS'));
  },
  credentials: true,
}));

export default app