const mongoose = require('mongoose')
const { default: slugify } = require('slugify')
const mongoosePaginate = require('mongoose-paginate-v2')

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        category:{
            type: String
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            default: '/uploads/none.jpg'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)


postSchema.plugin(mongoosePaginate)

postSchema.pre('validate', function(next) {
    if(this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true})
    }
    next()
})

module.exports = mongoose.model('Post', postSchema)