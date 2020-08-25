const jwt=require('jsonwebtoken');
const asynchandler = require('./async');
const errorResponce = require('../utils/errorResponse');
const User = require('../models/Users');

module.exports.protect= asynchandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.token){
      token=req.cookies.token;
      console.log(token);
    }

    if(!token){
        return next(new errorResponce('Login to get authorised access this route',401));
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new errorResponce('Not authorised to access this route',401));
    }
});

module.exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new errorResponce(
            `User role ${req.user.role} is not authorized to access this route`,
            403
          )
        );
      }
      next();
    };
  };