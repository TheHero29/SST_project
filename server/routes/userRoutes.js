const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const router = express.Router();

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
    res.status(200).send("User registered successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

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
    
    res.status(200).send({
      success:true,
      message:"User logged in successfully"
    });
  }
  catch(err){
    console.log(err);
    res.status(400).send(err);
  }

});

module.exports = router;
