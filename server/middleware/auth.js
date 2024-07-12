const jwt  = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];

    const verified = jwt.verify(token,process.env.TOKEN_SECRET);
    console.log(verified);
    req.body.userId = verified.userId;

    next();
  }
  catch(err){
    console.log(err);
  }
}

module.exports = auth;