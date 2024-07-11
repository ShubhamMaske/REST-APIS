import Joi from "joi";


const registerController = {
    register(req, res, next){
        //logic

        const resgisterSchema = Joi.object({
            name: Joi.string().min(2).max(20).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(/^[a-zA-Z0-9@]{3,30}$/).required(),
            repeat_password: Joi.ref('password')
        })

        const {error} = resgisterSchema.validate(req.body)

        if(error){
            console.log(error)
            res.json(error)
        }

        res.json({msg: "From register route"})
    }
}


export default registerController;