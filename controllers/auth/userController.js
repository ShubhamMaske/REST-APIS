import Boom from "@hapi/boom"
import { User } from "../../models/index.js"

const userController = {
    async me(req, res, next) {
        try {
            const user = await User.findOne({_id: req.user._id}).select('name email role createdAt')
            if(!user) {
                throw Boom.notFound("user not found")
            }

            res.json(user)
        } catch (err) {
            console.log(err)
            return next(err)
        }
    }
}

export default userController