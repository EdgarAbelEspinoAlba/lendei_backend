import mongoose, { Schema, Document } from 'mongoose'

export interface IClient extends Document {
    nss:string
    credito:string
    rfc:string
    curp:string
    nombre:string
    paterno:string
    materno: string
    nacimiento: Date
    calle: string
    interior: string
    exterior: string
    colonia: string
    ciudad: string
    estado: string
    cp: string
    email: string
    password: string
    adeudo: number
    agua: number
    luz: number
    predial: number
    infonavit: number
    gastos: number
}

const clientSchema = new Schema({
    nss:{
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    credito:{
        type: String,
        required: true,
        trim: true
    },
    rfc:{
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    curp:{
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    nombre:{
        type: String,
        required: true
    },
    paterno:{
        type: String,
        required: true
    },
    materno:{
        type: String,
        required: false,
        default: ''
    },
    nacimiento:{
        type: Date,
        required: false,
        default: null
    },
    calle:{
        type: String,
        required: false,
        default: ''
    },
    interior:{
        type: String,
        required: false,
        default: ''
    },
    exterior:{
        type: String,
        required: false,
        default: ''
    },
    colonia:{
        type: String,
        required: false,
        default: ''
    },
    ciudad:{
        type: String,
        required: false,
        default: ''
    },
    estado:{
        type: String,
        required: false,
        default: ''
    },
    cp:{
        type: String,
        required: false,
        default: ''
    },
    email:{
        type: String,
        required: false,
        default: ''
    },
    password:{
        type: String,
        required: false,
        default: ''
    },
    adeudo:{
        type: Number,
        required: false,
        default: null
    },
    agua:{
        type: Number,
        required: false,
        default: null
    },
    luz:{
        type: Number,
        required: false,
        default: null
    },
    predial:{
        type: Number,
        required: false,
        default: null
    },
    infonavit:{
        type: Number,
        required: false,
        default: null
    },
    gastos:{
        type: Number,
        required: false,
        default: null
    }
})

const Client = mongoose.model<IClient>('Client', clientSchema)

export default Client