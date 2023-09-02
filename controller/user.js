const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {User} = require('../model/database');
const db = require('../model/mongoose');


require('dotenv').config();




//For showing signup page
exports.signup = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','signup.html'));
};


exports.postData = async(req,res,next)=>{
    let t;

    try{

        t = await db.startSession();

        t.startTransaction();


        const {name,email,password} = req.body;
    
        //to check if all the inputs are filled
;        if(name.length>0 && email.length>0 && password.length>0){
            //To check if email exists
          
                const user = await User.findOne({ email: email });
    
                if (user) {
                    res.send('fail');
                    
                }
                else {
    
                    console.trace('No user found with the input email');
    
                    //creating new user
                    let hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUND))

                    const user = await User.create(
                        {
                             name: name,
                            email: email,
                            password: hash,
                            total_expense: 0.00,
                        },

                    );

                            
                    if(user.name === name){
                        res.send('success');
                        await t.commitTransaction();
                    }
       
                }
                
           
        }else{
            res.send('length');
        }        


    }catch(err){
        console.trace(err);
        await t.abortTransaction();
        res.send(err);

    }finally{
        await t.endSession();
    }

};



//to show login page for old users
exports.getlogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','public','login.html'));
};



//to validate login page
exports.postlogin = async(req,res,next)=>{
    
    try{
        const {email,password} = req.body;

        const user = await User.findOne({ email: email})

        if(user.email === email){
            let hash = user.password;
            let isValid = await bcrypt.compare(password,hash);

            if(isValid){
            
                let id = user.id;
                let token = jwt.sign({id:id},process.env.JWT_S_KEY);
                res.status(201).send({token: token});
            }
            else{ 
                res.send('incorrect');
            }

        }     
        else{ 
            res.send('incorrect');
        }
           
    }catch(err){
        res.send(err);
        console.trace('first try block error',err);
    }



            
};