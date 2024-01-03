const User = require('../model/userModel');

exports.getAllUserDetails = async(req,res) => {
    try{
        const users = await User.find({}).populate('tarnsactionDetails').exec();

        return res.status(200).json({
            success : true,
            message : users
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong while Getting all User Details'
        })
    }
};

exports.getSingleUserDetails = async (req,res) => {
    try{
        const {id} = req.body;

        const user = await User.findById(id).populate('tarnsactionDetails').exec();

        return res.status(200).json({
            success : true,
            message : user
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : 'Something went wrong while Getting Single User Details'
        })
    }
};