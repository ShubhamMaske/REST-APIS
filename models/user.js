
import mongoose from "mongoose";


const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: Number,
        required: true
    }
}, {timestamps: true})

export default mongoose.model('User', userSchema, 'users')