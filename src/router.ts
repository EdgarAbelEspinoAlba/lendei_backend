import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, getUser, login, updateProfile, updateImage, addClient, getSearchClient, updateClient } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'

const router = Router()

/** Autentificación y registro **/
router.post('/auth/register',
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
    body('name').notEmpty().withMessage('El Nombre no puede ir vacío'),
    body('email').isEmail().withMessage('Correo no válido'),
    body('password').isLength({ min: 8 }).withMessage('El password no cumple con la longitud mínima'),
    handleInputErrors,
    createAccount)

router.post('/auth/login',
    body('email').isEmail().withMessage('Correo no válido'),
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