const { response } = require('express')
const Post = require('../models/Post.model')
const Auth = require('../models/Auth.model')
const Comment = require('../models/Comment.model')
const { regex } = require('../helpers/Validation.helper')

//! Mostrar post en el home
const getPostMain = async (req, res = response) => {

  try {
    const posts = await Post.paginate({}, {
      page: req.query.page,
      limit: 6,
      sort: {createdAt: 'desc'}
    })
    const pages = posts.totalPages
    const postResult = posts.docs
    const title = 'SBlog - Inicio'
    res.status(200).render('home', {
      title,
      postResult,
      pages
    })
  } catch (error) {
    req.flash('error', 'Ocurrio un error')
    res.redirect('/')
  }
}


const searchPost = async (req, res = response) => {
  try {
    const result = await Post.find({title: {$regex: '.*' + req.query.search +'.*', $options:'i'}}).lean()
    res.status(200).render('search',{
      result,
      title: 'Resultados'
    })
  } catch (error) {
    console.log(error)
  }
}

const categorySearch = async (req, res = response) => {
  try {
    const result = await Post.find({category: req.query.category}).lean()
    res.status(200).render('search', {
      result,
      title: 'Resultados'
    })
  } catch (error) {
    console.log(error)
  }
}

//! PANEL DE POSTS
const getPanelPost = async (req, res = response) => {
  try {
    const posts = await Post.find({user: req.user.id}
    ).sort({createdAt: 'desc'}).lean() // Me deja un obj puro de JS

    const title = 'SBlog - Panel'
    res.status(200).render('panelPost', {
      title,
      posts,
    })
  } catch (error) {
    req.flash('error', 'Ocurrio un error')
    res.redirect('/')
  }
}

//! VER POSTS
const showPost = async (req, res = response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).lean()
    const userProfile = await Auth.findOne({_id: post.user}).lean()
    const comments = await Comment.find({postId: post._id}).lean()

    if (post === null) res.redirect('/')

    res.render('show', {
      title: `SBlog - ${post.title}`,
      post,
      userProfile,
      comments
    })

  } catch (error) {
    req.flash('error', 'Ocurrio un error')
    res.redirect('/posts')
  }
}

//! RENDER DEL NEW PSOT
const newPost = (req, res = response) => {
  try {
        
    res.status(200).render('new', {
      title:'Crear Post'
    })
  } catch (error) {
    console.log(error)
  }
}

//!CREAR POST
const createPost = async (req, res = response) => {
    try {
        let  {title, body, category} = req.body
        let image
        if(title.length< 3 && title.length >36){
          req.flash('error', 'Titulo no valido')
          return res.redirect('/')
        }

        if(req.file == undefined){
          image = '/uploads/none.jpg'
        }else {
          image = '/uploads/' + req.file.filename
        }

        const newPost = new Post({title, body, user: req.user.id, image, category})
        await newPost.save()

        res.redirect(`/posts/${newPost.slug}`)

    } catch (error) {
      console.log(error)
        req.flash('error', 'Ha ocurrido un error')
        return res.redirect('/')
    }
}

const createComment = async (req, res = response) => {
  try {
    let { comment } = req.body
    if(comment.length < 3 && comment.length > 140){
      req.flash('error', 'Comentario no valido')
      return res.redirect(`/posts/${req.params.slug}`)
    }

    const newComment = new Comment({author: req.params.user, comment, postId: req.params.post})
    await newComment.save()
    req.flash('success', 'Comentario agregado')
    res.redirect(`/posts/${req.params.slug}`)
  } catch (error) {
    req.flash('error', 'Ocurrio un error')
    res.redirect(`/posts/${req.params.slug}`)
  }
}

//! ELIMINAR POSTS
const deletePost = async (req, res = response) => {
  try {
      await Post.findByIdAndDelete(req.params.id)

      req.flash('success', 'Post eliminado correctamente')
      res.redirect('/posts')

  } catch (error) {
    req.flash('error', 'Ocurrio un error')
    res.redirect('/posts')
  }
}

// Show Post Form Edit

const showPostFormEdit = async (req, res = response) => {

    try {
        const postEdit = await Post.findById(req.params.id).lean()

        res.render('edit', {
            title: 'Editando Post',
            postEdit
        })
        
    } catch (error) {
      req.flash('error', 'Ocurrio un error')
      res.redirect('/')
    }
}

const editPost = async (req, res = response) => {
  try {
    const { title, body, category } = req.body

    if(!regex.titleValid.test(title)){
      req.flash('error', 'Titulo no valido')
      return res.redirect('/')
    }

    await Post.findByIdAndUpdate(req.params.id, {title, body, category})
    req.flash('success', 'Post Editado')
    res.redirect('/posts')
  }catch(error){
    req.flash('error', 'Ocurrio un error')
    res.redirect('/posts')
  }
}

module.exports = {
  getPanelPost,
  showPost,
  deletePost,
  createPost,
  newPost,
  showPostFormEdit,
  getPostMain,
  editPost,
  createComment,
  searchPost,
  categorySearch
}
