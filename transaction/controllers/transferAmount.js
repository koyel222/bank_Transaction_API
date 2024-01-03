const User = require('../model/userModel');

//This Function will give Us Random Cash Back whis is Awarded to Sender
function CaskBackHandler(amount){
    //If the Amount is Multiple of 500 then No Cash back
    if(amount % 500 === 0){
        return 0;
    }
    else{
        //If the Amount is Under 1000 then Cash back will be within 0 to 5% of Transaction Amount
        if(amount < 1000){
            let range = (amount * 5) / 100;
            return Math.floor(Math.random() * range)
        }
        //Else the Amount is Above 1000 then Cash back will be within 0 to 2% of Transaction Amount
        else{
            let range = (amount * 2) / 100;
            return Math.floor(Math.random() * range)
        }
    }
}

exports.transfer = async(req,res) => {
    try{
        //Fecth Receiver's Phone Number and Transaction Amount
        const {receiverNumber , amount} = req.body;
        //Fetch ID of Sender's
        const {id} = req.user;

        //Finding Receiver by his Phone Number
        const receiverUser = await User.findOne({contactNumber : receiverNumber});

        //If Receiver Not Present
        if(!receiverUser){
            return res.status(400).json({
                success : false,
                message : 'You Entered Wrong Phone Number'
            })
        }

        //Else Receiver Present
        //Now Find the Details Of Sender By his Id
        const senderUser = await User.findById(id);

        //If Transaction Amount is Greater than User Bank Balance then Transaction is not Possible
        if(amount > senderUser.balance){
            return res.status(400).json({
                success : false,
                message : 'insufficient Balance. Kindly Check and Try Again'
            })
        }

        //This is User for Format Date in GMT
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);

        // Update Receiver's Balance and Save
        receiverUser.balance = receiverUser.balance += amount;
        receiverUser.tarnsactionDetails.push(`+ ${amount} Time : ${today.toISOString()}`)
        receiverUser.save();

        //Get CashBack by Calling this Function
        let cashBack = CaskBackHandler(amount);

        // Update Sender's Balance and Save
        senderUser.balance = senderUser.balance -= amount;
        senderUser.balance = senderUser.balance += cashBack;
        senderUser.tarnsactionDetails.push(`- ${amount} Time : ${today.toISOString()}`)
        senderUser.tarnsactionDetails.push(`+ ${cashBack} Cash Back Time : ${today.toISOString()}`)
        senderUser.save();

        //Retrun Success Message
        return res.status(200).json({
            success : true,
            message : `Receiver Balance : ${receiverUser.balance} & , ${cashBack == 0 ? "Don't Get Any Cash Back. Better Luck Next Time" : `Congrats! You Got ${cashBack} Cash Back`} User Balance : ${senderUser.balance}`
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something went wrong while Transaction'
        })
    }
};

