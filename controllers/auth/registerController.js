import Joi from "joi";
import Boom from "@hapi/boom";
import { User } from "../../models/index.js";
import bcrypt from 'bcrypt'
import JwtService from "../../services/JwtService.js";
// import { JWT_REFRESH_SECRET } from "../../config/index.js";

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
                throw Boom.conflict('User email already exist')
            }

        } catch(err) {
            return next(err)
        }

        const { name, email, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)

        let access_token
        let refresh_token

        try {
            const user = await User.create({ name, email, password:hashPassword })
            console.log("user -> ", user)
            access_token = JwtService.sign({ _id: user._id, role: user.role})
        } catch (err) {
            console.log("error in creating user", err)
        }

        res.json({access_token, refresh_token})
    }
}


export default registerController;