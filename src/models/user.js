const mongoose = require('mongoose');
const validator = require('validator');
const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'First name is required'], 
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [10, 'First name cannot exceed 10 characters']
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [10, 'Last name cannot exceed 10 characters']
    },
    emailId: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true, 
        lowercase: true, 
        index :true ,
        validate: {
            validator: function (value) {
                return validator.isEmail(value) && allowedDomains.includes(value.split('@')[1]);
            },
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    age: {
        type: Number,
        min: [18, 'Age must be at least 18'], 
        max: [100, 'Age must be less than 100'] 
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'], 
    },
    photoUrl:{
        type : String,
        default :""
    },
    about : {
        type : String,
        default :"This is a default of the user !"
    },
    skill :{
        type : [String]
    },
    createdAt :{
        type : Date
    }
}, { timestamps: true }); 

userSchema.methods.getJWT = async function(){
   const user = this //(this) ==> instance of the model  in object you can fetch any data with help of this
   const token = await jwt.sign({_id : user._id} ,process.env.SECRET_JWTKEY ,{expiresIn : "7d"})
   return token
}

userSchema.methods.validatePassword = async function(passwordByUser){
    const user = this 
    const hashpassword = user.password
    const isPassword = await bcrypt.compare(passwordByUser, hashpassword)
    return isPassword
 }

module.exports = mongoose.model('User', userSchema);


