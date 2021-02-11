require('dotenv').config();

const mongoose = require('mongoose')



const connectDataBase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    }).then(con => {
        console.log(`MongoDB połączone z cluster em: ${con.connection.host}`.magenta.underline)
    })
}

module.exports = connectDataBase