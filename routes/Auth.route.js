const express = require('express')
const { showAuthFormSignUp, signup, showAuthFormSignIn, signin, logout } = require('../controllers/Auth.controller')
const isAuthenticated = require('../middlewares/isauthenticated')
const routerAuth = express.Router()

// Routes
//* Render form SignUp y Post Method
routerAuth.get('/auth/signup', showAuthFormSignUp)
routerAuth.post('/auth/signup', signup)

//* Render form SignIn y Post Method
routerAuth.get('/auth/signin', showAuthFormSignIn)
routerAuth.post('/auth/signin', signin)

//* User Logout
routerAuth.get('/auth/logout', isAuthenticated, logout)



module.exports = {
    routerAuth
}