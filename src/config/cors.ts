import { CorsOptions } from 'cors'

const whiteList: (string | undefined)[] = []

if (process.env.FRONTEND_URL) {
  whiteList.push(process.env.FRONTEND_URL)
}

whiteList.push(undefined)

console.log('[CORS] Lista blanca:', whiteList)

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    console.log('[CORS] Origen recibido:', origin)
    
    if (whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Error de CORS: origen no permitido'))
    }
  },
  credentials: true
}
