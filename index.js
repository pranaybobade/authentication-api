require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const { connectDB } = require('./Connection/databaseConnection');
const { errorHandling } = require('./Middleware/error');
const cors = require('cors');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
connectDB();


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


const allowOrigin = 'https://authentication-mern.onrender.com'

const corsOptions = {
  origin: (origin, callback) => {
    if (allowOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed by cors'))
    }
  },
  credentials: true,
  optionSuccessStatus: 200
}


app.use(cors(corsOptions))

const userRouter = require('./Routes/userRoute');
app.use('/user', userRouter);

// Error Handling
app.use(errorHandling);

mongoose.connection.once('open', () => {
  console.log(`Connected To MONGODB`);
  app.listen(PORT, () => {
    console.log(`app is started on ${PORT}`);
  })
})


mongoose.connection.on('error', err => {
  console.log(err);
})