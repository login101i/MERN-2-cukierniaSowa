const express = require("express")

const app = express()
const errrorMiddleware=require('./middlewares/errors')
const bodyParser = require('body-parser')

const cookieParser=require('cookie-parser')
const fileUpload=require('express-fileupload')



app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(fileUpload())

// import routes

const products=require('./routes/product')
const user= require('./routes/user')
const order= require('./routes/order')


app.use('/api/v1', products)
app.use('/api/v1', user)
app.use('/api/v1', order)



app.use(errrorMiddleware)

module.exports=app