const { response } = require('express')
const { regex } = require('../helpers/Validation.helper')
const passport = require('passport')

const Auth = require('../models/Auth.model')


//! Registar
const showAuthFormSignUp = (req, res = response) => {
    res.render('auth/signup', {
        title:'Sign Up'
    })
}

const signup = async (req, res = response) => {

    try {
        const { name, email, password, confirm_password } = req.body

        if (password !== confirm_password) {
            req.flash('error', 'Las contraseñas no coinciden')
            return res.redirect('/auth/signup')
        }
    
        if(!regex.email.test(email)){
            req.flash('error', 'Ingrese un email valido')
            return res.redirect('/auth/signup')
        }
    
        if (!regex.password.test(password)) {
            req.flash('error', 'La contraseña debe tener al menos 8 caracteres')
            return res.redirect('/auth/signup')
        }
    
        const userFound = await Auth.findOne({ email })
        if (userFound) {
            req.flash('error', 'El mail ya existe en nuestro registros')
            return res.redirect('/auth/signup')
        }
    
        const newUser = new Auth({ name, email, password, avatar: '/uploads/noneAvatar.png' })
        newUser.password = await newUser.passwordEncrypt(password)
        await newUser.save()
        req.flash('success', 'Se registró correctamente')
        res.redirect('/auth/signin')
    } catch (error) {
        console.log({catch: error})
        req.flash('error', 'Ocurrio un error')
        res.redirect('/')
    }

}


//! Login de usuario

const showAuthFormSignIn = (req, res = response) => {
    res.render('auth/signin', {
        title: 'Sign In'
    })
}

const signin = passport.authenticate('local', {
    successRedirect: '/posts',
    successFlash: {
        type: 'success',
        message: 'Logeado'
    },
    failureRedirect: '/auth/signin',
    failureFlash: {
        type: 'error',
        message: 'Usuario o contraseña invalido'
    }
})


//! Logout
const logout = async (req, res = response, next) => {
    await req.logout((err) => {
        if (err) return next()
        req.flash('success', 'Session cerrada')
        res.redirect('/auth/signin')
    })
}

module.exports = {
    showAuthFormSignUp,
    signup,
    showAuthFormSignIn,
    signin,
    logout,
}