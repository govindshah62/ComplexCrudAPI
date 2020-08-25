const ErrorResponse = require('../utils/errorResponse');
const Course= require('../models/Courses');
const Bootcamp= require('../models/Bootcamp');
const asynchandler = require('../middleware/async');

module.exports.getcourses= asynchandler(async(req,res,next)=>{
    if(req.params.bootcampId){
        const course = await Course.find({bootcamp:req.params.bootcampId});
        res.status(200).json({
            success:true,
            count:course.length,
            data:course
        });
    }else{
        res.status(200).json(res.advancedResults);
    } 
});

module.exports.getcourse = asynchandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description'
    });
  
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),404);
    }
  
    res.status(200).json({
      success: true,
      data: course
    });
  });

module.exports.addcourse = asynchandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user=req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  
    if (!bootcamp) {
      return next(
        new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),404);
    }
    if(bootcamp.user.toString()!==req.user.id&&req.user.role!=='admin'){
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a Course to bootcamp ${bootcamp.id} `,401));
    }

    const course = await Course.create(req.body);
  
    res.status(200).json({
      success: true,
      data: course
    });
  });

module.exports.updatecourse = asynchandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),
        404
      );
    }
    if(course.user.toString()!==req.user.id&&req.user.role!=='admin'){
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update the course ${course.id} `,401));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      success: true,
      data: course
    });
  });

module.exports.deleteCourse = asynchandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
  
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),404);
    }
    if(course.user.toString()!==req.user.id&&req.user.role!=='admin'){
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete a Course ${course.id} `,401));
    }
    await course.remove();
  
    res.status(200).json({
      success: true,
      data: {}
    });
  });