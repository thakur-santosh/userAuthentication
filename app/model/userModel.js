const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate : {
            validator : function(value){
                return validator.isEmail(value)
            },
            message  : function(){
                return 'invalid email'
            }
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 9,
        maxlength : 128
    },
    tokens : [
        {
            token : {
                type : String
            },
            createdAt : {
                type : Date,
                default : Date.now
            }
        }
    ]
})

// pre hook
userSchema.pre('save',function(next){
    const user = this
    if(user.isNew){
        bcryptjs.genSalt(10)
    .then(function(salt){
        bcryptjs.hash(user.password,salt)
        .then(function(encPassword){
            user.password = encPassword
            next()
        })
    })
    }else{
        next()
    }
    
})

// own static  method
userSchema.statics.findByCredential = function (email,password) {
        const User = this
        return User.findOne({email}) // User.findOne({email : email}) using es6 propperty
            .then(user =>{
                if(!user){
                    return Promise.reject('Invalid email')
                }

                return bcryptjs.compare(password,user.password)
                .then(result =>{
                    return Promise.resolve(user)
                })
                .catch(err =>{
                    return Promise.reject('Invalid password')
                })
            })
            .catch(err =>{
                return Promise.reject(err)
            })
}


userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData
    try {
        tokenData =jwt.verify(token,'jwt@123')
    } catch (error) {
        return Promise.reject(error)
    }
    return User.findOne({
        _id : tokenData._id,
        'tokens.token' : token
    })
}


// own instance method
userSchema.methods.generateTokens = function(){
    const user = this
    const tokenData = {
        _id : user._id,
        name : user.name,
        createdAt : Number(new Date())
    }
    const token = jwt.sign(tokenData,'jwt@123')
    user.tokens.push({
        token : token
    })
    return user.save()
    .then(user =>{
        return Promise.resolve(token)
    })
    .catch(err =>{
        return Promise.reject(err)
    })
    
}


const User = mongoose.model('User',userSchema)

module.exports = User