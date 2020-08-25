const mongoose = require('mongoose');

const connectDB = async()=>{
    const conn= await mongoose.connect(process.env.mongouriRemote,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true,
        useFindAndModify:false
    });
    console.log(`MongoDB connected ${conn.connection.host}`);
};

module.exports = connectDB;