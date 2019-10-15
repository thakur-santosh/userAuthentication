const express = require('express')
const app = express()
const port = 3011
const mongoose = require('./configure/database')
const router = require('./configure/router')
app.use(express.json())

app.get('/',(req,res)=>{
    res.json({
        notice : 'Welcome to user auth'
    })
})

app.use('/',router)

app.listen(port,()=>{
    console.log('listining to port : ' , port)
}) 

