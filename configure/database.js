const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/user-auth',{ useUnifiedTopology: true ,useNewUrlParser: true})
.then(()=>{
    console.log('connected to database')
})
.catch(err =>{
    console.log(err)
})

