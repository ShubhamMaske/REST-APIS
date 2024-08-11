import Joi from "joi";
import Boom from "@hapi/boom";
import { User, RefreshToken } from "../../models/index.js";
import bcrypt from 'bcrypt'
import JwtService from "../../services/JwtService.js";
import { JWT_REFRESH_SECRET } from "../../config/index.js";

const loginController = {
    async login(req, res, next){
        //logic

        // validate the request body
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(/^[a-zA-Z0-9@]{3,30}$/).required(),
        })

        const {error} = loginSchema.validate(req.body)

        if(error){
            return next(error)
        }

        // check user is authorize or not
        try {
            const user = await User.findOne({email: req.body.email})
            if(!user) {
                throw Boom.unauthorized("user not exist with this email")
            }

            // validating the password
            const validPassword = await bcrypt.compare(req.body.password, user.password)

            if(!validPassword) {
                throw Boom.unauthorized("Invalid password")
            }

            const access_token = JwtService.sign({ _id: user._id, role: user.role})
            const refresh_token = JwtService.sign({ _id: user._id, role: user.role}, '1y', JWT_REFRESH_SECRET)

            // storing refresh token in database
            await RefreshToken.create({token: refresh_token})

            res.json({access_token, refresh_token})

        } catch(err) {
            return next(err)
        }

    },

    async logout(req, res, next) {
        try {
            await RefreshToken.deleteOne({token: req.body.refresh_token})
            res.json({"status":1})
        } catch (err) {
            console.log(err)
            return next(new Error("Something went wrong"))
        }
    }
}

export default loginController;