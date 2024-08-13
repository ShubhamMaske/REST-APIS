import { User } from "../models/index.js"
import Boom from "@hapi/boom";

const admin = async (req, res, next) => {
    try {
        const user = await User.findOne({_id: req.user._id})
        if(user.role === 'admin') {
            next()
        } else {
            throw Boom.unauthorized("unAuthorized")
        }
    } catch (err) {
        return next(err);
    }
}

export default admin;