const jwt = require('jsonwebtoken');
const sk = require('../credentials/jwtSecret');

exports.auth = (req,res,next)=>{
    
    let token = req.header('Authorization');
    


    jwt.verify(`${token}`,sk,(err,decode)=>{
        if(err){
            console.error("errorr at auth 11 >>>>>>",err);
            res.redirect('/user/login');
        }else{
            console.log("ans at auth 14>>>>>>",decode);
            req.userID = decode.id;
            next();
        }
    });
    
};