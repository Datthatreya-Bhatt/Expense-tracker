const path = require('path');
require('dotenv').config();
const Sib = require('sib-api-v3-sdk');
const {v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize  } = require('sequelize');

const {User,FPR} = require('../model/database');


const sequelize = new Sequelize('expense', 'root', process.env.SQL_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
  });

//For showing forgotpassword page
exports.getforgotpasswordPage = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','forgotpassword.html'));

};



//For sending email
exports.getEmail = async (req,res,next)=>{
    const t = await sequelize.transaction();
    let email = req.body.email;
    let uid = uuid();
    let userid = '';

    try{
        let user = await User.findOne({
            attributes: ['id','email'],
            where: {
                email: email
            }

        })

        if(user){
            userid = user.id;
            
        }
        
        let data = await FPR.create({
            id: uid,
            userId: Number(userid),
            isActive: true 

        },{transaction: t})

        
    }catch(err){
        await t.rollback();
        console.error(err);
    }

    try{  
        const client = Sib.ApiClient.instance;

        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SIB_API_KEY;

        const transactionalEmailsApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'techkosha@gmail.com'
        }

        const receivers = [
            {
                email: `${email}`
            }
        ]

        
        let emailRes = await transactionalEmailsApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'test',
            textContent: `http://localhost:3000/password/resetpassword/${uid}`
        })

        res.send('success');
        
    await t.commit();
    }catch(err){
        await t.rollback();
        console.error('line 88',err);
    }

};



exports.getResetPage = async(req,res,next)=>{
    let uid = req.params.id;

    try{
        let data = await FPR.findOne({
           // attributes: ['id','isActive'],
            where: {
                id: uid,
                isActive: 1
               
            }
        })
        console.log(data);
        if(data != null && data.isActive){
            res.status(200).sendFile(path.join(__dirname,'../','public','resetpassword.html'));
        }else{
            res.send('cannot find emailll');
        }
    }catch(err){
        console.error(err);
    }


};

exports.postResetPas = async(req,res,next)=>{
    let uid = req.params.id;
    let password = req.body.password;
    let t = await sequelize.transaction();

    try{
        let data = await FPR.findOne({
            attributes: ['id','userId','isActive'],
            where: {
                id: uid,
                isActive: true
            }
        })
        console.log(data,'line 130',data.isActive);
        if(data.isActive){
            try{
                let fpr = await FPR.update({
                    isActive: false
                },{
                    where: {
                        id: uid
                    },
                    transaction: t
                })




                //creating new user
                const saltRound = 10;
                let hash = await bcrypt.hash(password,saltRound);
                
                console.trace(hash);
                
                try {
                    let user = await User.update({
                        password: hash
                    },{
                        where: {
                            id: data.userId
                        },
                        transaction: t
                    })
                    console.trace(user,user[0]);
                    if(user){
                        let id = user[0];
                        let token = jwt.sign({id:id},process.env.JWT_S_KEY);
                        res.status(201).send(token);
                        console.trace(user);
                    }
                 } catch (err) {
                    console.error(err);
                    
                 }





            }catch(err){
                console.error(err);
            }
        }
    await t.commit();
    }catch(err){
        await t.rollback();
        console.error(err);
    }
};