const mongoose= require('mongoose');
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken');

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
      },
      password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
      createdAt: {
        type: Date,
        default: Date.now
      }  
});

//hashing the password
userschema.pre('save',async function(next){
  const salt= await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
});
//getting token.
userschema.methods.gettoken=function(next){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:'1d'});
};

//compare password
userschema.methods.comparepassword= async function(enteredpassword){
  return await bcrypt.compare(enteredpassword,this.password);
};

module.exports=mongoose.model('User',userschema);