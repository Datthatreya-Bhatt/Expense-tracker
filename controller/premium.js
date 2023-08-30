const path = require('path');
const AWS = require('aws-sdk');
const { Sequelize  } = require('sequelize');

require('dotenv').config();

const {User, DownloadedFile,Expense} = require('../model/database');



const sequelize = new Sequelize('expense', 'root', process.env.SQL_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
  });


//For showing expense page
exports.getPremiumPage = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','premium.html'));

};

exports.getLeaderBoard = async(req,res,next)=>{
    
  try{

    
    let leaderBoard = await User.findAll({
      attributes:['name','total_expense'] ,
      order: [['total_expense', 'DESC']]
    });
    
  


    res.send(leaderBoard);
  
  }catch(err){
    console.error(err);
  }
  
};


async function uploadToS3(data,fileName){
  try{
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    
    })

  
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: data,
      ACL: 'public-read'
    }

   
    return new Promise((resolve,reject)=>{
      s3bucket.upload(params,(err,s3Res)=>{
      if(err){
        console.trace('something went wrong: ',err);
        reject(err);
       
      }
      else{
        console.trace('success', s3Res);
        resolve(s3Res);

      }


      })
    })
    /*,  */
   

  }catch(err){
    console.trace(err);
  }

};






exports.downloadExpense = async(req,res,next)=>{
    try{
		    let t = await sequelize.transaction();
        let id = req.userID;
        const user = await Expense.findAll({
            where:{
                userId:id
            }
        });
        if(user){
          let stringyfy = JSON.stringify(user);
          let filename = `Expense${id}-${new Date()}.txt`;
          let fileUrl = await uploadToS3(stringyfy,filename);
          

		  let link1 = await DownloadedFile.create({
			userId: id,
			links: fileUrl.Location
		  },
		  {transaction: t
		  })
      console.trace(link1);
          res.status(200).send(fileUrl.Location);  
        }
    
    t.commit();
    }catch(err){
        t.rollback();
        console.error(err);
        res.status(500).send(err);
    }


};





exports.downloadList = async(req,res,next)=>{

  let id = req.userID;
  try{
    let list = await DownloadedFile.findAll({
      attributes: ['userId','links'],
      where: {
        userId: id
      }
    })
    console.trace(list);
    res.send(list);
  }catch(err){
    console.trace(err);
  }


}







