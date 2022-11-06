const express = require('express')
const routerUser = express.Router()

const { viewProfile, renderEditProfile, editProfile } = require('../controllers/User.controllers')


routerUser.get('/profile/:id', viewProfile)

routerUser.get('/profile/edit/:id', renderEditProfile)
routerUser.post('/profile/edit/:id', editProfile)


module.exports = {
    routerUser
}