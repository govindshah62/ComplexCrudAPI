const ErrorResponse = require('../utils/errorResponse');
const Bootcamp= require('../models/Bootcamp');
const asynchandler = require('../middleware/async');

module.exports.getbootcamps=asynchandler(async(req,res,next)=>{
        res.status(200).json(res.advancedResults);
   
});

module.exports.getbootcamp=  asynchandler(async (req,res,next)=>{
        const bootcamp= await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404));   
        }
        res.status(200).json({success:true, data:bootcamp});
        
});

module.exports.createbootcamp= asynchandler(async(req,res,next)=>{
        req.body.user=req.user.id;
        const publishedbootcamp=await Bootcamp.findOne({user:req.user.id});
        if(publishedbootcamp&&req.user.role!=='admin'){
                return next(new ErrorResponse( `The user with id ${req.user.id} has already published a bootcamp`,400));
        }
        const bootcamp = await Bootcamp.create(req.body);
        res.status(200).json({success:true, data:bootcamp});     
});

module.exports.updatebootcamp=asynchandler(async(req,res,next)=>{
        let bootcamp= await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamps not found with id ${req.params.id}`,404));
        }
        if(bootcamp.user.toString()!==req.user.id&&req.user.role!=='admin'){
                return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this boootcamp`,401));
        }
        bootcamp= await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
                new:true,
                runValidators:true
            });
        res.status(200).json({success:true, data:bootcamp});
});

module.exports.deletebootcamp= asynchandler(async(req,res,next)=>{
        const bootcamp= await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamps not found with id ${req.params.id}`,404));
        }
        if(bootcamp.user.toString()!==req.user.id&&req.user.role!=='admin'){
                return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this boootcamp`,401));
        }
        bootcamp.remove();
        res.status(200).json({success:true, data:{}}); 
});
