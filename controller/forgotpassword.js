const path = require('path');
const Sib = require('sib-api-v3-sdk');
const {v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();


const {User,ForgotPasswordRequests} = require('../model/database');
const db = require('../model/mongoose')


//For showing forgotpassword page
exports.getforgotpasswordPage = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','forgotpassword.html'));

};



//For sending email
exports.getEmail = async (req,res,next)=>{

    let t;

    try{
        t = await db.startSession();
        t.startTransaction();

        let email = req.body.email;
        let uid = uuid();
        let userid = '';



        let user = await User.findOne({
            email: email
        })

        if(user){
            userid = user._id;
            
        }
        
        let data = await ForgotPasswordRequests.create({
            id: uid,
            userId: userid,
            isActive: true 

        })

        
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
        
        await t.commitTransaction();
    }catch(err){
        res.send(err);
        console.trace(err);
        await t.abortTransaction();
    }finally{
        await t.endSession();
    }

};



exports.getResetPage = async(req,res,next)=>{

    try{
        let uid = req.params.id
        let data = await ForgotPasswordRequests.findOne({
            id: uid,
            isActive: 1
        })

        console.log(data);
        if(data != null && data.isActive){
            res.status(200).sendFile(path.join(__dirname,'../','public','resetpassword.html'));
        }else{
            res.send('cannot find emailll');
        }
    }catch(err){
        console.trace(err);
        res.send(err);
    }


};

exports.postResetPas = async(req,res,next)=>{

    let t;
    try{
        let uid = req.params.id;
        let password = req.body.password;

        t = await db.startSession();
        t.startTransaction();
    
        let data = await ForgotPasswordRequests.findOne({
            id: uid,
            isActive: true
        })

        console.trace(data,data.isActive);

        if(data.isActive){
      
            let fpr = await ForgotPasswordRequests.update({
                id: uid
            },
            {
                isActive: false
                
            })

            //creating new user
            const saltRound = 10;
            let hash = await bcrypt.hash(password,saltRound);
            
            console.trace(hash);
                
        
            let user = await User.updateOne({
                _id: data.userId
            },{
                password: hash
            })

            if(user){
                let id = user[0];
                let token = jwt.sign({id:id},process.env.JWT_S_KEY);
                res.status(201).send({token: token});
                console.trace(user);
            }
     
        }
        await t.commitTransaction();
    }catch(err){
        console.trace(err);
        await t.abortTransaction();

    }finally{
        await t.endSession();
    }

};