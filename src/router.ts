import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, getUser, login, updateProfile, updateImage, addClient, getSearchClient, updateClient } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'

const router = Router()
const isValidPhone = (value: string) =>
    /^\+?[\d\s().-]{7,20}$/.test(value) && (value.match(/\d/g) || []).length >= 7

/** Autentificación y registro **/
router.post('/auth/register',
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
    body('name').notEmpty().withMessage('El Nombre no puede ir vacío'),
    body('email').isEmail().withMessage('Correo no válido'),
    body('phone').optional({ checkFalsy: true }).custom((value) => {
        if (typeof value !== 'string' || !isValidPhone(value.trim())) {
            throw new Error('Teléfono no válido')
        }
        return true
    }),
    body('password').isLength({ min: 8 }).withMessage('El password no cumple con la longitud mínima'),
    handleInputErrors,
    createAccount)

router.post('/auth/login',
    body().custom((_, { req }) => {
        const identifier = req.body.identifier ?? req.body.email ?? req.body.phone
        if (typeof identifier !== 'string' || !identifier.trim()) {
            throw new Error('El correo o teléfono es obligatorio')
        }

        const value = identifier.trim()
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        const isPhone = isValidPhone(value)
        if (!isEmail && !isPhone) {
            throw new Error('Ingresa un correo o teléfono válido')
        }

        return true
    }),
    body('password').notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    login
)

router.get('/user',
    authenticate
    , getUser
)

router.patch('/user',
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
    body('phone').optional({ checkFalsy: true }).custom((value) => {
        if (typeof value !== 'string' || !isValidPhone(value.trim())) {
            throw new Error('Teléfono no válido')
        }
        return true
    }),
    handleInputErrors,
    authenticate,
    updateProfile
)

router.post('/user/image',
    authenticate,
    updateImage
)

/** Autentificación Cliente **/
router.post('/client',
    body('nss').notEmpty().withMessage('El Número de Seguro Social no puede ir vacío'),
    body('curp').notEmpty().withMessage('La CURP no puede ir vacía'),
    body('rfc').notEmpty().withMessage('El RFC no puede ir vacío'),
    body('nombre').notEmpty().withMessage('El Nombre no puede ir vacío'),
    body('paterno').notEmpty().withMessage('El Apellido Paterno no puede ir vacío'),
    body('nss').isLength({ min: 11 }).withMessage('El Número de Seguro Social no cumple con la longitud mínima'),
    body('curp').isLength({ min: 18 }).withMessage('La CURP no cumple con la longitud mínima'),
    body('rfc').isLength({ min: 13 }).withMessage('El RFC no cumple con la longitud mínima'),
    addClient
)

router.post('/searchClient',
    authenticate
    , getSearchClient
)

router.post('/updateClient',
    authenticate
    , updateClient
)

export default router
