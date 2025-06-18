const mongoose = require("mongoose")
const Joi = require("joi")
const { validateUpdateUser } = require("./User")

//Product Schema
const ProductSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim:true,
        minLength : 2,
        maxLength : 200
    },
    description :{
        type : String,
        required : true,
        trim:true,
        minLength : 10,
    },
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    category: {
        type : String,
        required : true
    },
    image :{
        type   :Object,
        default : {
            url : "",
            publicId : null
        }
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
}, {
    timestamps : true
})

//Product Model 
const Product = mongoose.model("Product",ProductSchema)

//Validate Create Product 
function validateCreateProduct(obj){
    const schema = Joi.object({
        title : Joi.string().trim().min(2).max(200).required(),
        description : Joi.string().trim().min(10).required(),
        category : Joi.string().trim().required(),
    })
    return schema.validate(obj)
}

//Validate Update Product 
function validateUpdateProduct(obj){
    const schema = Joi.object({
        title : Joi.string().trim().min(2).max(200),
        description : Joi.string().trim().min(10),
        category : Joi.string().trim(),
    })
    return schema.validate(obj)
}

module.exports = {
    Product , 
    validateCreateProduct,
    validateUpdateProduct
}