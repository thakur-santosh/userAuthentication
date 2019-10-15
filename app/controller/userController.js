const User = require('../model/userModel')

module.exports.list = (req,res) =>{
            User.find()
            .then(user =>{
                if(user){
                    res.json(user)
                }else{
                    res.json({})
                }
            })
            .catch(err =>{
                res.json(err)
            })
}

module.exports.register=(req,res) =>{
    const body = req.body
    const user = new User(body)
    user.save()
    .then(user =>{
        res.json(user)
    })
    .catch(err=>{
        res.json(err)
    })
}

module.exports.login= (req,res) =>{
    const body = req.body
    User.findByCredential(body.email,body.password)
    .then(user =>{
        if(user){
            // res.json(user)
            return user.generateTokens()
        }
    })
    .then(token =>{
        res.setHeader('x-auth',token).send({})
    })
    .catch(err =>{
        res.json(err)
    })
    .catch(err =>{
        res.json(err)
    })

}

module.exports.account = (req,res) =>{
    const user = req.user
    res.json(user)
}

module.exports.destroy = (req,res) =>{
    const user = req.user
    const token = req.token


    User.findByIdAndUpdate(user._id,{$pull : {tokens : {token : token}}})
    .then(user =>{
        res.send('token deleted')
    })
    .catch(err =>{
        res.send(err)
    })
}



    // User.findOne({email : body.email})
    // .then(user =>{
    //     if(!user){
    //         res.status('404').send('Invalid email')
    //     }
    //     bcryptjs.compare(body.password,user.password)
    //     .then(result =>{
    //         if(result){
    //             res.json(user)
    //         }else{
    //             res.send('Invalid Password')
    //         }
    //     })
    //     .catch(err =>{
    //         res.json(err)
    //     })
    // })
    // .catch(err=>{
    //     res.json(err)
    // })