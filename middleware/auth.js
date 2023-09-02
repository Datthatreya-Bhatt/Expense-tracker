const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async (req,res,next)=>{
    
    let token = req.header('Authorization');

    
    let validity = await jwt.verify(`${token}`,process.env.JWT_S_KEY);


    if(validity){
        req.userID = validity.id;
        next();
        
    }else{
        console.trace(validity);
        res.redirect('/user/login');
       
    }
    
};