const express= require('express');
const {getbootcamp,
        getbootcamps,
        createbootcamp,
        updatebootcamp,
        deletebootcamp} = require('../controller/bootcamp');
const {protect,authorize} = require('../middleware/auth');
const courseRouter=require('./courses');
const Bootcamp = require('../models/Bootcamp');
const advancedResult = require('../middleware/advanceResult');
const router= express.Router();
router.use('/:bootcampId/courses',courseRouter);

router.route('/').get(advancedResult(Bootcamp, 'courses') ,getbootcamps)
        .post(protect,authorize('publisher','admin'),createbootcamp);
router.route('/:id').get(getbootcamp).put(protect,authorize('publisher','admin'),updatebootcamp)
.delete(protect,authorize('publisher','admin'),deletebootcamp);

module.exports = router;