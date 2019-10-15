const express = require('express')
const router = express.Router()
const authenticateUser = require('../app/middleware/authenticate')

const userController = require('../app/controller/userController')

router.get('/users',userController.list)
router.post('/users/register',userController.register)
router.post('/users/login',userController.login)
router.get('/users/account',authenticateUser,userController.account)

router.delete('/users/logout',authenticateUser,userController.destroy)
// router.get('/users/account',userController.account)

module.exports = router