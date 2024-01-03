const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.logIn = async(req,res) => {
    try{
        //Fetch the Required Information
        const {contactNumber , password} = req.body;

        //Validation Check
        if(!contactNumber || !password){
            return res.status(400).json({
                success : false,
                message : 'Enter the Details Carefully'
            })
        }

        //Check For User
        const user = await User.findOne({contactNumber : contactNumber});
        //If User Not Find
        if(!user){  
            return res.status(400).json({
                success : false,
                message : 'User is Not Present Do Registration First'
            })
        }

        //If user is Present in DB
        //Now check whether the Password is matching or not
        //If Matched
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email : user.email,
                id : user._id,
                balance : user.balance
            }
            //create Token
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn : '1h'
            })
            user.token = token;
            user.password = undefined;

            const options = {
                expires : new Date(Date.now() + 1 * 60 * 60 * 1000),
                httpOnly : true
            }
            //Create Cookie and attach Token into the Cookie
            return res.cookie('token',token,options).status(200).json({
                success : true,
                user,
                message : 'You are Successfully Logged In'
            })
        }
        //If Password not matched
        res.status(400).json({
            success : false,
            message : 'Icorrect Password'
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong while User Logging'
        })
    }
};