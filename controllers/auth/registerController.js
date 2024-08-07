import Joi from "joi";
import Boom from "@hapi/boom";
import { User } from "../../models/index.js";
import bcrypt from 'bcrypt'

const registerController = {
    async register(req, res, next){
        //logic

        // validate the request body
        const resgisterSchema = Joi.object({
            name: Joi.string().min(2).max(20).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(/^[a-zA-Z0-9@]{3,30}$/).required(),
            repeat_password: Joi.ref('password')
        })

        const {error} = resgisterSchema.validate(req.body)

        if(error){
            return next(error)
        }

        // check user is already exist or not
        try {
            const user = await User.exists({email: req.body.email})

            if(user){
                throw Boom.internal('User email already exist')
            }

        } catch(err) {
            throw Boom.internal(err.message)
        }

        const { name, email, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)

        try {
            const user = await User.create({ name, email, password:hashPassword })
        } catch (err) {
            console.log("error in creating user", err)
        }

        res.json({msg: "From register route"})
    }
}


export default registerController;