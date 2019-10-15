const User = require('../model/userModel')

const authenticateUser = (req,res,next) =>{
    const token = req.header('x-auth')
    User.findByToken(token)
    .then(user =>{
        if(user){
        req.user = user
        req.token = token
        next()
        }else{
            res.send('logout')
        }
        
        // res.json(user)
    })
    .catch(err =>{
        res.json(err)
    })
}

module.exports = authenticateUser