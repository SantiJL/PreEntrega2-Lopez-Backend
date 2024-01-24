import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { db } from '../config/index.config.js'

dotenv.config()

const connectMongo = async() => {
    try {
        console.log("·db -------------" ,db)
        console.log((`mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.name}`))
        await mongoose.connect(`mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.name}`)
        console.log('MongoDB connected')
    }catch(error) {
        console.log(error)
    }
}

export default connectMongo;