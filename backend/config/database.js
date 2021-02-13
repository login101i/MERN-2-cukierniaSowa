require('dotenv').config();

const mongoose = require('mongoose')



const connectDataBase = () => {
    mongoose.connect("mongodb+srv://login101i:Login111@cluster0.lmztu.mongodb.net/MERN2_cukierniaSowa?retryWrites=true&w=majority", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    }).then(con => {
        console.log(`MongoDB połączone z cluster em: ${con.connection.host}`.magenta.underline)
    })
}

module.exports = connectDataBase