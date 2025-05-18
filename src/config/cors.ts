import { CorsOptions } from 'cors'

const whiteList: (string | undefined)[] = []

if (process.env.FRONTEND_URL) {
  whiteList.push(process.env.FRONTEND_URL)
}

if (process.argv.includes('--api')) {
  whiteList.push(undefined)
}

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Error de CORS: origen no permitido'))
    }
  },
  credentials: true
}
