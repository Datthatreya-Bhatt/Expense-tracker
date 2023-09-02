const path = require('path');

const {User, Expense, Orders} = require('../model/database');
const db = require('../model/mongoose');

require('dotenv').config();





//For showing expense page
exports.getData= (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','public','expense.html'));

};

exports.getExpenseData = async (req,res,next)=>{

    
    try{
   
        let id = req.userID;
        let page = Number( req.params.page);
        let limit = Number(req.query.limit);



        const user = await Expense.find({userId:id })
        .skip((page-1)*limit)
        .limit(limit);

        let count = await Expense.countDocuments({ userId: id });


        count = Math.ceil(count/limit);
        let obj = {
            count: count,
            page: page
        }
  
        if(user){
            res.send({user: user,obj:obj});
        }
        else{
            res.send('fail')
            console.log('expense control line 31',user);
        }
    
    }catch(err){
        console.trace(err);
        res.send(err)
    }


};


exports.postData = async (req,res,next)=>{
    let t;
    try{
    
        let {amount,description,category} = req.body;

         t = await db.startSession();

         t.startTransaction();

        if(amount.length>0 && description.length>0 && category.length>0){
            let id = req.userID;

            //updating expense table
            const expense = await Expense.create(
                {
                    amount:amount,
                    description:description,
                    category: category,
                    userId: id,
                   
                }
            )
            if(expense){
                res.send('success from postData');
                
            }
            else{
                res.send('expense/postData error');
                console.trace('expense/postData error');
            }


            //updating user table
            let user = await User.findOne({ _id: id  })


            let ex = Number(user.total_expense)  + Number(amount);

            let update = await User.updateOne({
                _id: id, 
            },{
                total_expense: ex
            })


            if(update){
                await t.commitTransaction();
            }


        }

        }catch(err){
            console.error(err);
            await t.abortTransaction();

        }finally{
            await t.endSession();
        }

    
};

exports.deleteData = async (req,res,next)=>{
    let t;
    try{

        let id = req.userID;
        let entry = req.params.id;
        let amount = 0;



        t = await db.startSession();
        t.startTransaction();

        //for getting amount from Expense table
        let data  = await Expense.findOne({
            userId:id,
            _id:entry
            
        });

        //for getting data from user table

        let data2 = await User.findOne({
            _id: id
        })

        amount = Number(data2.total_expense) - Number(data.amount);

        if(data && data2){
            console.log('no error');
        }
        else{
            console.trace('error in delete');
        }



        //for updating database
        
        const update = await User.updateOne({
            _id: id
           
        },{
            total_expense: amount
        })

        if(update){
        console.log('success');
        }

      



        
        //for deleting from database
     
        const user = await Expense.deleteOne({
            userId:id,
            _id:entry

        });

        if(user){
            res.send('success');
        
        }else{
            res.send('fail');
        }

       


        await t.commitTransaction();

    }
    catch(err){
        console.trace(err);
        await t.abortTransaction();
    
    }finally{
        await t.endSession();
    };


};







exports.isPremium = async(req,res,next)=>{

    try{
        let id = req.userID;

        let data = await Orders.findOne({
            userId: id,
            status: 'SUCCESS'
        })

        if(data){
            res.send("PREMIUM");
        }else{
            console.log('NOT A PREMIUM USER');
        }


    }catch(err){
        console.trace(err);
        res.send(err);
    }
};
