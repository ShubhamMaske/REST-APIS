import Boom from "@hapi/boom";
import JwtService from "../services/JwtService.js";

const auth = async (req, res, next) => {
    let authHeader = req.headers['authorization'];
    console.log(authHeader)
    try {
        if(!authHeader) {
            throw Boom.unauthorized("unAuthorized")
        }
        const token = authHeader.split(' ')[1];
        console.log(token)

        const { _id, role } = await JwtService.verify(token)

        req.user = {}
        req.user._id = _id;
        req.user.role = role

        next()
    } catch (err) {
        return next(err)
    }
    
}

export default auth;