const express = require('express');
const {getusers,getuser,createuser,updateuser,deleteuser}=require('../controller/user');
const router = express.Router({mergeParams:true});
const User = require('../models/Users');

const advancedResult = require('../middleware/advanceResult');
const {protect,authorize} = require('../middleware/auth');

//anything below protect and authorize will be protected and authorized.    
router.use(protect);                
router.use(authorize('admin'));
router.route('/').get(advancedResult(User),getusers,).post(createuser);
router.route('/:id').get(getuser).put(updateuser).delete(deleteuser);

module.exports= router;