const mongoose = require("mongoose")
const Joi = require("joi")
const jwt = require("jsonwebtoken")


const UserSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
        trim:true,
        minLength : 2,
        maxLength : 100
    },
    email:{
        type : String,
        required : true,
        trim:true,
        minLength : 5,
        maxLength : 100,
        unique : true
    },
    password:{
        type : String,
        required : true,
        trim:true,
        minLength : 8,
        maxLength : 70,
    },
    prfilePhoto:{
        type : Object,
        default: {
            uri : "https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_1280.png",
            publicId:null
        }
    },
    bio: String,
    isAdmin:{
        type : Boolean,
        default : false
    },
    isAccountVerified:{
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})

//Generate Auth Token 
UserSchema.methods.generateAuthToken = function(){
    return jwt.sign({id:this._id,isAdmin:this.isAdmin},process.env.JWT_SECRET,
        {expiresIn:'30d'}
    )
}


//User Model 
const User = mongoose.model("User",UserSchema)

//Validate Regiter User
function validationRegisterUser(obj){
    const schema = Joi.object({
        username : Joi.string().trim().min(2).max(100).required(),
        email : Joi.string().trim().min(5).max(70).required().email(),
        password : Joi.string().trim().min(8).required(),
    })
    return schema.validate(obj)
}

//Validate Login User
function validationLoginUser(obj){
    const schema = Joi.object({
        email : Joi.string().trim().min(5).max(70).required().email(),
        password : Joi.string().trim().min(8).required(),
    })
    return schema.validate(obj)
}

module.exports = {
    User,
    validationRegisterUser,
    validationLoginUser
}