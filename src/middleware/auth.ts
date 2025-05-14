import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

declare global {
    namespace Express {
        interface Request {
            user ?: IUser
        }
    }
}
export const authenticate = async (request : Request, response : Response, next: NextFunction) => {
    try {
        const bearer = request.headers.authorization
        const [, token] = bearer.split(' ')
        if(!bearer || !token){
            const errorNotAuth = new Error('Sin Autorización')
            response.status(401).json({ error : errorNotAuth.message})
            return
        }
            const result = jwt.verify(token, process.env.JWT_SECRET)
            if(typeof result === 'object' && result.id){
                const user = await User.findById(result.id).select('-password')
                if(!user){
                    const errorUserNotFound = new Error('Usuario no encontrado')
                    response.status(404).json({ error : errorUserNotFound.message})
                }
                request.user = user
                next()
            }
        } catch (error) {
            const errorNotAuth = new Error('Sin Autorización')
            response.status(404).json({ error : errorNotAuth.message})
            return
        }
}