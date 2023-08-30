const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');

const {User} = require('../model/database'); 

require('dotenv').config();


const sequelize = new Sequelize('expense', 'root',  process.env.SQL_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
  });



//For showing signup page
exports.signup = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','signup.html'));
};


exports.postData = async(req,res,next)=>{
    const t = await sequelize.transaction();

    const {name,email,password} = req.body;

    //to check if all the inputs are filled
    if(name.length>0 && email.length>0 && password.length>0){
        //To check if email exists
        try {
            const user = await User.findOne({
              where: {
                email: email,
              },
              attributes: ['email'],
            });

            if (user) {
                res.send('fail');
                const email = user.email;
                
            }
            else {

                console.log('No user found with the input email');

                //creating new user
                const saltRound = 10;
                bcrypt.hash(password,saltRound,async(err,hash)=>{
                    if(err){
                        console.error('enryption error',err);
                    }
                    else{
                        try {
                            
                            const user = await User.create({
                              name: name,
                              email: email,
                              password: hash,
                              total_expense: 0.00,
                            },{transaction: t
                            });
                        
                            if(user){
                                res.send('success');
                                await t.commit();
                            }

                        } catch (error) {
                            await t.rollback();
                            console.error('Error creating user:', error);
                        }
                    }  
              
                });
                //
            }
            
        } catch (error) {
        console.error(error);
        }
    }else{
        res.send('length');
    }        
};





//to show login page for old users
exports.getlogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','public','login.html'));
};

//to validate login page
exports.postlogin = async(req,res,next)=>{
    const {email,password} = req.body;
    
    //to check password and email

    try{
        const user = await User.findOne({
            where:{
                email: email 
            }
        })

        if(user){
            let hash = user.dataValues.password;
            bcrypt.compare(password,hash,async(err,result)=>{
               if(result){
                    try{
                        const user = await User.findOne({
                            where:{
                                password:hash
                            }
                        })
                        if(user){
                            let id = user.dataValues.id;
                            let token = jwt.sign({id:id},process.env.JWT_S_KEY);
                            res.status(201).send(token);
                            
                        }else{
                            console.error('error at postlogin')
                        }
                    }catch(err){
                        res.status(500);
                        console.log(err);
                    }
                    
               }
               else if(err){
                console.log(err);
               }
               else{
                
                    res.send('incorrect');
               }
            });
        }
        else if(user === null){
             res.send('incorrect');
        }
        else{
            res.status(500).send('error');
            console.log(err);
        }


    }catch(err){
        console.log('first try block error',err);
    }



            
};