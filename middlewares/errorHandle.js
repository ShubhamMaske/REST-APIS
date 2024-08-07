import { DEBUG_MODE } from "../config/index.js"
import pkg from 'joi';
const { ValidationError } = pkg;
import Boom from "@hapi/boom";

const errorHandler = (err, req, res, next) => {
    let statusCode = 500
    let data = {
        message: "Internal server error",
        ...(DEBUG_MODE === 'true' && {errorMessage: err.message})
    }

    if(err instanceof ValidationError){
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    if (Boom.isBoom(err)) {
        return res.status(err.output.statusCode).json(err.output.payload);
    }


    return res.status(statusCode).json(data)
}

export default errorHandler