const Razorpay = require('razorpay');

const {Orders} = require('../model/database');

require('dotenv').config();

const db = require('../model/mongoose')



exports.getPurchase = async(req,res,next)=>{
    let t;
    try{
        t = await db.startSession();
        t.startTransaction();

        let amount = 99999;
        
        let rzp = new Razorpay({
            key_id: RAZORP_KEY_ID,
            key_secret: RAZORP_KEY_S
        })
        
        rzp.orders.create({
        amount: amount,
        currency: "INR",
        },
        async(err,order)=>{
            if(err){
                console.error(err);
            }else{
                
                order.key = RAZORP_KEY_ID;
                res.send(order);
                
                const data = await Orders.create({
                    paymentid: "No id now",
                    orderid: order.id,
                    status: "pending",
                    userId: req.userID,
                    
                })

                if(data){
                    console.log('order table created');
                    
                }
                else{
                    console.trace('error in creating order table');
                }
                   
            }
        });

        await t.commitTransaction();

    }catch(err){
        res.send(err);
        console.trace(err);
        await t.abortTransaction();

    }finally{
        await t.endSession();
    }
};


exports.postSuccess = async(req,res,next)=>{

    let t;
    try{
        let order_id = req.body.res.razorpay_order_id;
        let payment_id = req.body.res.razorpay_payment_id;

        let data = await Orders.updateOne({
            orderId: order_id
            
        },{
            orderid: order_id,
            paymentid: payment_id,
            status: 'SUCCESS',
            userId: req.userID,
        })

        if(data){
            res.send('task complete');
            await t.commitTransaction();
        }else{
            console.log('error in post success line 86');
        }

        

    }catch(err){
        console.trace(err);
        res.send(err);
        await t.abortTransaction();

    }finally{
        await t.endSession();
    }
    
};


exports.postFailed = async(req,res,next)=>{

    let t;
    try{
        let order_id = req.body.res.error.metadata.order_id;
        let payment_id = req.body.res.error.metadata.payment_id;

        t = await db.startSession();
        t.startSession();
    
        let data = await Orders.updateOne({
            orderid: order_id
        },
        {
            orderid: order_id,
            paymentid: payment_id,
            status: 'FAILED',
            userId: req.userID,
         }) 

        
        if(data){
            res.send('task complete');
            await t.commitTransaction();
        }else{
            console.trace('error in post failed line 124');
        }

    }catch(err){
        console.trace(err);
        res.send(err);
        await t.abortTransaction();

    }finally{
        await t.endSession();
    }

    

};



