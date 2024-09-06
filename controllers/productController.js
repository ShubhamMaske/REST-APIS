import { Product } from '../models/index.js'
import multer from 'multer'
import path from 'path'
import Joi from 'joi'
import fs from 'fs'
import productSchema from '../validator/productValidator.js'


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
  },

  async update (req, res, next) {
    try {
      // processing the multipart form data

      handleMultipartData(req, res, async (err) => {
        if (err) {
          return next(new Error(err.message))
        }

        
        let filePath
        if(req.file){
          filePath = req.file.path
        }

        const { error } = productSchema.validate(req.body)

        if (error) {
          //delete the uploaded file if error occure

          if(req.file) {
              fs.unlink(`${appRoot}/${filePath}`, (err) => {
                if(err) {
                    return next(new Error(err.message))
                }
              })
          }
      
            return next(error)
        }

        const { name, price, size } = req.body
        let document;

        document = await Product.findOneAndUpdate({_id: req.params.id},{
            name,
            price,
            size,
            ...(req.file && {image: filePath})
        },{ new : true})  // this new:true we are adding to get updated data form db

        res.status(201).json(document)
      })
    } catch (err) {
      console.log(err)
    }
  },

  async destroy (req, res, next) {
    const document = await Product.findOneAndDelete({_id: req.params.id})

    if(!document) {
      return next(new Error('product not found'))
    }

    // deleting the image
    const imagePath = document.image
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {

      if(err) {
        return next(new Error('server error, unable to delete image'))
      }
    })

    res.json(document)
  },

  async index (req, res, next) {
    let documents
    try {
      // we can use mongoose-pagination library for pagination
      //we will get only name & price fields along with _id
      documents = await Product.find().select('name price').sort({_id: -1})
    } catch (err) {
      return next(err)
    }
    return res.json(documents)
  }
}

export default productController
