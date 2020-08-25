const errorResponce = require('../utils/errorResponse');
const asynchandler  = require('../middleware/async');
const User= require('../models/Users');

module.exports.register = asynchandler(async(req,res,next)=>{
    const {name,email,password,role}=req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    tokencookie(user,200,res);
});

module.exports.login = asynchandler(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return next(new errorResponce('please provide email and password',400));
    }
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return next(new errorResponce('Invalid Credientials',401));
    }
    const ismatched = await user.comparepassword(password);
    if(!ismatched){
        return next(new errorResponce('Invalid Credientials',401));
    }
    tokencookie(user,200,res);
}); 

const tokencookie= (user,statuscode,res)=>{
    const token=user.gettoken();

    const options={
        expires: new Date(
            Date.now()+30*24*24*60*1000),
        httpOnly:true
    };
    console.log(options.expires);
    res
        .status(statuscode)
        .cookie('token',token,options)
        .json({success:true,token});
};

module.exports.getme= asynchandler(async(req,res,next)=>{
    const user=await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        data:user
    });
});

module.exports.logout= asynchandler(async(req,res,next)=>{
    res.cookie('token','none',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        data:{}
    });
});

module.exports.updateDetails= asynchandler(async(req,res,next)=>{
    const fieldstoupdate={
        name:req.body.name,
        email:req.body.email
    }
    const user= await User.findByIdAndUpdate(req.user.id,fieldstoupdate,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        success:true,
        data:user
    });
});

module.exports.updatePassword= asynchandler(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password');

    if(!(await user.comparepassword(req.body.currentPassword))) {
        return next(new errorResponce('Invalid Password',401));
    }

    user.password=req.body.newPassword;
    await user.save();
    tokencookie(user,200,res);
});