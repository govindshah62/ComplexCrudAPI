const express = require('express');
const dotenv = require('dotenv');
const bootcamp = require('./routes/bootcamp');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const user=require('./routes/user');
const cookieparser = require('cookie-parser');
const logger = require('./middleware/logger');
const connectDB = require('./config/db');
const errorhandler=require('./middleware/error');

dotenv.config({path: './config/config.env'});
connectDB();
const app=express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());


app.use(logger);
app.use('/api/v1/bootcamps',bootcamp);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',user);


app.use(errorhandler);


const server= app.listen(PORT, ()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
});

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.message}`);
    server.close(()=>process.exit(1));
});