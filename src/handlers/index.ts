import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from 'slug'
import User from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt'
import formidable from 'formidable'
import cloudinary from '../config/cloudinary'
import { v4 as uuid } from 'uuid'
import Client from '../models/Client'

export const createAccount = async (request: Request, response: Response) => {
    const { email, password } = request.body
    const handle = slug(request.body.handle, '')
    const userExists = await User.findOne({ email })
    const handleExists = await User.findOne({ handle })

    if (userExists || handleExists) {
        const errorUserFind = new Error('Usuario ya creado anteriormente ó no disponible')
        response.status(409).json({ error: errorUserFind.message })
        return
    }

    const user = new User(request.body)
    user.password = await hashPassword(password)
    user.handle = handle

    await user.save()
    response.status(201).send('Registro creado correctamente')
}

export const login = async (request: Request, response: Response) => {
    const { email, password } = request.body
    const user = await User.findOne({ email })
    if (!user) {
        const errorUserNotFound = new Error('El usuario no se encontró')
        response.status(404).json({ error: errorUserNotFound.message })
        return
    }

    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        const errorPasswordIncorrect = new Error('La contraseña no es válida')
        response.status(401).json({ error: errorPasswordIncorrect.message })
        return
    }

    const token = generateJWT({ id: user.id, name: user.name })
    response.send(token)
}

export const getUser = async (request: Request, response: Response) => {
    response.status(200).json(request.user)
    return
}

export const updateProfile = async (request: Request, response: Response) => {
    try {
        const { description, links } = request.body
        const handle = slug(request.body.handle, '')
        const handleExists = await User.findOne({ handle })
        if (handleExists && handleExists.email !== request.user.email) {
            const errorUserFind = new Error('Usuario ya creado anteriormente ó no disponible')
            response.status(409).json({ error: errorUserFind.message })
            return
        }

        request.user.description = description
        request.user.handle = handle
        request.user.links = links
        await request.user.save()
        response.status(200).send('Perfil actualizado correctamente')
    } catch (e) {
        const error = new Error('Se encontro un error, favor de verificar')
        response.status(500).json({ error: error.message })
        return
    }
}

export const updateImage = async (request: Request, response: Response) => {
    try {
        const form = formidable({ multiples: false })
        form.parse(request, (error, fields, files) => {
            cloudinary.uploader.upload(files.file[0].filepath,
                {
                    public_id: uuid()
                },
                async function (error, result) {
                    if (error) {
                        console.log('Entro a error')
                        const error = new Error('Se encontro un error al cargar la imagen.')
                        response.status(500).json({ error: error.message })
                        return
                    }
                    if (result) {
                        console.log('Entro a Success')
                        request.user.image = result.secure_url
                        await request.user.save()
                        response.status(200).json({ image: result.secure_url })
                        return
                    }
                })
        })
    } catch (e) {
        const error = new Error('Se encontro un error, favor de verificar')
        response.status(500).json({ error: error.message })
        return
    }
}

export const addClient = async (request: Request, response: Response) => {
    const { nss, curp } = request.body
    const existNss = await Client.findOne({ nss })
    const existCurp = await Client.findOne({ curp })
    if (existNss || existCurp) {
        const errorClientFind = new Error('Cliente ya creado anteriormente ó no disponible')
        response.status(409).json({ error: errorClientFind.message })
        return
    }
    const client = new Client(request.body)
    client.adeudo = Number(request.body.adeudo.replace(/[$,]/g, ""))
    client.agua = Number(request.body.agua.replace(/[$,]/g, ""))
    client.luz = Number(request.body.luz.replace(/[$,]/g, ""))
    client.predial = Number(request.body.predial.replace(/[$,]/g, ""))
    client.infonavit = Number(request.body.infonavit.replace(/[$,]/g, ""))
    client.gastos = Number(request.body.gastos.replace(/[$,]/g, ""))
    await client.save()
    response.status(201).send('Registro creado correctamente')
}

export const getSearchClient = async (request: Request, response: Response) => {
    try {
        const { nss, curp } = request.body

        let client = null

        if (nss) {
            client = await Client.findOne({ nss });
        } else if (curp) {
            client = await Client.findOne({ curp });
        } else {
            response.status(400).json({ error: 'Se requiere NSS o CURP para la búsqueda.' })
            return
        }

        if (!client) {
            response.status(401).json({ error: 'El Cliente no se encontró' })
            return
        }
        response.status(200).json(client)
        return
    } catch (error) {
        response.status(500).json({ error: 'Error del servidor', details: error })
        return
    }
}

export const updateClient = async (request: Request, response: Response) => {
    try {
        const { curp, nss, ...updateData } = request.body

        let client = null

        if (nss) {
            client = await Client.findOne({ nss });
        } else if (curp) {
            client = await Client.findOne({ curp });
        } else {
            response.status(400).json({ error: 'Se requiere NSS o CURP para la búsqueda.' })
            return
        }

        if (!client) {
            response.status(401).json({ error: 'El Cliente no se encontró' })
            return
        }

        const updatedClient = await Client.findByIdAndUpdate(
            client._id,
            updateData,
            { new: true, runValidators: true }
        )
        response.status(200).json({ message: 'Cliente actualizado correctamente', client: updatedClient })
        return
    } catch (error) {
        response.status(500).json({ error: 'Error del servidor', details: error })
        return
    }
}

