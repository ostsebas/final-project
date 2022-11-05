const mongoose = require('mongoose')

const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('Database connected')

    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    dbConnection
}