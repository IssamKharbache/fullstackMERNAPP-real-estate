import express from 'express';
import mongoose from 'mongoose';
import  dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

//connecting to data base
mongoose.
connect(process.env.MONGO).
then(()=>{
    console.log("Connection successfully")
}).catch((err)=>{
    console.log("Connection failed");
    console.log(err);
});


//running server
const app = express();

app.use(express.json())

app.use(cookieParser());

app.listen(3000,() =>{
    console.log('Server is running on port 3000 ');
});
//user api router

app.use('/api/user',userRouter);

//authentifaction api router
app.use('/api/auth',authRouter);

//creating the middleware

app.use((err,req,res,next)=>{
const statusCode = err.statusCode || 500;
const message = err.message || 'Internal server Error';
return res.status(statusCode).json({
    success :false,
    statusCode,
    message,

});
});