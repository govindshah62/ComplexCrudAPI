const express= require('express');
const router= express.Router({mergeParams:true});
const {getcourses,getcourse,addcourse,updatecourse,deleteCourse} = require('../controller/courses');
const {protect,authorize} = require('../middleware/auth');
const Courses= require('../models/Courses');
const advancedResult = require('../middleware/advanceResult');

router.route('/').get(advancedResult(Courses, {
    path:'bootcamp',
    select:'name description'
}) ,getcourses).post(protect,authorize('publisher','admin'),addcourse); 

router.route('/:id').get(getcourse).put(protect,authorize('publisher','admin'),updatecourse)
.delete(protect,authorize('publisher','admin'),deleteCourse); 


module.exports = router; 