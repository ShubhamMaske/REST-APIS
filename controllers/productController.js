import { Product } from '../models/index.js'
import multer from 'multer'
import path from 'path'
import Joi from 'joi'
import fs from 'fs'


//configure the multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${path.extname(file.originalname)}`

    cb(null, uniqueName)
  }
})

// limits: { fileSize:1000000 * 5 }  using this we mention the maximum size of file allowed
const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 }
}).single('image')

const productController = {
  async store (req, res, next) {
    try {
      // processing the multipart form data

      handleMultipartData(req, res, async (err) => {
        if (err) {
          return next(new Error(err.message))
        }

        console.log(req.file)
        const filePath = req.file.path

        // validate the request body
        const productSchema = Joi.object({
          name: Joi.string().required(),
          price: Joi.number().required(),
          size: Joi.string().required()
        })

        const { error } = productSchema.validate(req.body)

        if (error) {
            fs.unlink(`${appRoot}/${filePath}`, (err) => {
                if(err) {
                    return next(new Error(err.message))
                }
            })

            return next(error)
        }

        const { name, price, size } = req.body

        let document;

        document = await Product.create({
            name,
            price,
            size,
            image: filePath
        })

        res.status(201).json(document)
      })
    } catch (err) {
      console.log(err)
    }
  }
}

export default productController
