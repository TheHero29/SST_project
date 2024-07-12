const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
require("dotenv").config();


//for registering a user
router.post("/register", async (req, res) => {
  try {
    const userExist = await User.findOne({ email:req.body.email });
    if (userExist) {
      return res.status(400).send({
        success:false,
        message:"User already exists"
      });
    }

    //salting and hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save(); 
    res.send(
      {
        success:true,
        message:"User registered successfully"
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});


//for logging in a user
router.post("/login", async (req, res) => {
  try{
    const userExist = await User.findOne({ email:req.body.email });
    if (!userExist) {
      return res.status(400).send({
        success:false,
        message:"User does not exist"
      });
    }

    //comparing the password
    const validPassword = await bcrypt.compare(req.body.password,userExist.password);
    if(!validPassword){
      return res.status(400).send({
        success:false,
        message:"Invalid Password"
      });
    }
    
    //creating token or signing the token
    const token = jwt.sign({_id:userExist._id},process.env.TOKEN_SECRET,{expiresIn:"1d"});

    res.status(200).send({
      success:true,
      message:"User logged in successfully",
      token:token
    });

  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});

router.get('/get-current-user',authMiddleware, async(req,res)=>{
  try{
    const user = await User.findById(req.body.userId).select('-password');
    res.status(200).send(
      {
        success:true,
        message:"You are authorized",
        data:user
      }
    );
  }
  catch(err){
    console.log(err);
    res.status(400).send({
      success:false,
      message:"You are not authorized"
    });
  }
})

module.exports = router;
