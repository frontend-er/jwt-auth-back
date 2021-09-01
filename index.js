require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const router = require('./router/index.js')
const errorsMiddleware = require('./middlewares/errors-middleware.js')

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use(errorsMiddleware) // обязарельно должен быть последним в цепочке 


const start = async () => {
   try {
      await mongoose.connect(process.env.DB_URl)
      app.listen(PORT, () => {
         console.log('Server started on port ' + PORT)
      })
   } catch (error) {
      console.log(error);
   }
}


start()