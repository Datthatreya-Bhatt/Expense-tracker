const path = require('path');
const AWS = require('aws-sdk');

require('dotenv').config();

const {User, DownloadedFile,Expense} = require('../model/database');
const db = require('../model/mongoose');

//For showing expense page
exports.getPremiumPage = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','premium.html'));

};


//For showing leaderboard page
exports.getLeaderboardPage = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','leaderboard.html'));

};

exports.getLeaderBoard = async(req,res,next)=>{
    
  try{

    
    let leaderBoard = await User.find({})
    .select('name','total_expense')
    .sort({total_expense: 'desc'});

    res.send(leaderBoard);
  
  }catch(err){
    console.trace(err);
    res.send(err);
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
  
   

  }catch(err){
    console.trace(err);
  }

};






exports.downloadExpense = async(req,res,next)=>{
    let t;
    try{
        let id = req.userID;

		t = await db.startSession();
        t.startTransaction();

        const user = await Expense.find({
            userId:id
        });

        if(user){
          let stringyfy = JSON.stringify(user);
          let filename = `Expense${id}-${new Date()}.txt`;
          let fileUrl = await uploadToS3(stringyfy,filename);
          

		  let link1 = await DownloadedFile.create({
			userId: id,
			links: fileUrl.Location
		  })

          console.trace(link1);
          res.status(200).send(fileUrl.Location);  
        }
    
        await t.commitTransaction();

    }catch(err){
        res.status(500).send(err);
        console.trace(err);
        await t.abortTransaction();
    }finally{
        await t.endSession();
    }


};



exports.getDownloadedListPage = (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','downloadlist.html'));

};

exports.downloadList = async(req,res,next)=>{

  try{
    let id = req.userID;
    let list = await DownloadedFile.find({
        userId: id
    })

    // console.trace(list);
    res.send(list);
  }catch(err){
    console.trace(err);
    res.send(err);
  }


}







