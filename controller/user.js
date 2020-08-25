const errorResponce = require('../utils/errorResponse');
const asynchandler  = require('../middleware/async');
const User= require('../models/Users');


module.exports.getusers = asynchandler(async(req,res,next)=>{
    res.status(200).json(res.advancedResults);
});

module.exports.getuser = asynchandler(async(req,res,next)=>{
 const user = await User.findById(req.params.id);

 res.status(200).json({
     success:true,
     data:user
 });
});

module.exports.createuser = asynchandler(async(req,res,next)=>{
    const user = await User.create(req.body);
    
    
    res.status(200).json({
        success:true,
        data:user
    });
});

module.exports.updateuser = asynchandler(async(req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
       
    res.status(200).json({
        success:true,
        data:user
    });
});

module.exports.deleteuser = asynchandler(async(req,res,next)=>{
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
        success:true,
        data:{}
    });
});
