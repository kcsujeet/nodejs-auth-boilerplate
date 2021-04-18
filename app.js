const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const dotEnv = require('dotenv')

// configure env variables
dotEnv.config()

// import routes 
const authRoutes = require('./routes/authRoutes');
const { requireAuth } = require('./middleware/authMiddleware');

// initialize app
const app = express();


// configure middlewares
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth , (req, res) => res.render('smoothies'));
app.use('/auth',authRoutes)

// database connection
const dbURI = `mongodb://localhost:27017/${process.env.DB_NAME}`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then((result) => {
  app.listen(process.env.PORT, function(){
    console.log(`Server running at port:${process.env.PORT} 🚀`)
  })
}).catch((err) => console.log(err));