const Posts = require('../models/Post.model')
const Auth = require('../models/Auth.model')
const { resizeImg, delImage } = require('../helpers/Delete.helper')
const { regex } = require('../helpers/Validation.helper')

//! Ver perfil del usuario

const viewProfile = async (req, res = response) => {
    try {
        const userProfile = await Auth.findOne({ _id: req.params.id }).lean() // Me deja un obj puro de JS
        const userPost = await Posts.find({ user: req.params.id }).lean()

        res.status(200).render('profile/profile', {
            userProfile,
            title: `User ${userProfile.name}`,
            userPost
        })
    } catch (error) {
        console.log({catch: error})
        req.flash('error', 'Ocurrio un error')
        res.redirect('/')
    }
}

const renderEditProfile = async (req, res) => {
    try {
        const userProfile = await Auth.findOne({ _id: req.params.id }).lean()

        res.status(200).render('profile/editProfile', {
            userProfile,
            title: 'Editando Perfil'
        })
    } catch (error) {
        console.log({catch: error})
        req.flash('error', 'Ocurrio un error')
        res.redirect('/')
    }
}

const editProfile = async (req, res) => {
    try {
        const { username, aboutme } = req.body
        const user = await Auth.findById(req.params.id)
        
        if(!regex.username.test(username)){
            req.flash('error', 'Ocurrio un error')
            return res.redirect(`/profile/edit/${req.params.id}`)
        }
        if(aboutme.length > 140){
            req.flash('error', 'Ocurrio un error 2')
            return res.redirect(`/profile/edit/${req.params.id}`)
        }

        if(req.file){
            if(user.avatar !== '/uploads/noneAvatar.png'){
                await delImage('.'+user.avatar)
            }
            await resizeImg(req.file.path, 'avatar', req.file.filename, 128)
            await delImage(`./uploads/${req.file.filename}`)
            
            await Auth.findByIdAndUpdate(req.params.id, {name: username, about: aboutme, avatar: '/uploads/avatar/'+ req.file.filename})
        }else{
            await Auth.findByIdAndUpdate(req.params.id, {name: username, about: aboutme})
        }
        req.flash('success', 'Perfil editado')
        res.redirect(`/profile/${req.params.id}`)
        

    } catch (error) {
        console.log({catch: error})
        req.flash('error', 'Ocurrio un error')
        res.redirect('/')
    }
}

module.exports = {
    viewProfile,
    renderEditProfile,
    editProfile
}