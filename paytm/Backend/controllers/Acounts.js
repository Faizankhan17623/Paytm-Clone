const Account = require('../models/Accounts')
const Users = require('../models/Profile')
const mongoose = require('mongoose')
exports.CreateBalance = async(req,res)=>{
    try {
        const id = req.user.id 
        const {DepositMoney} = req.body;
        const Finding = await Users.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"This id is not benn found",
                successs:false
            })
        }
        const updating = await Account.findOneAndUpdate({userId:id},{$inc :{balance:DepositMoney}},{new:true,upsert:true})

        console.log("The money that has come is ",updating)

        return res.status(200).json({
            message:"This is the updated Amount",
            successs:true,
            data:updating
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"There is some error from the backend",
            success:false
        })
    }
}

exports.getTotalBalance = async (req,res) => {
    try{
        const id = req.user.id 
        const Finding = await Account.findOne({userId:id})
        if(!Finding){
            return res.status(400).json({
                message:"This id is not benn found",
                successs:false
            })
        }
        console.log('The total amount is',Finding)
        return res.status(200).json({
            message:"This is the updated Amount",
            successs:true,
            data:Finding
        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"There is some error from the backend",
            success:false
        })
    }
    
}


exports.TransferMoney = async(req,res)=>{
    try {


        const fromAccountId = req.user.id
        const {Transferamount,toAccountId} = req.body
        
        // first we willl check if the id that is coming the user is present or not 
        const userFindings = await Users.findOne({_id:toAccountId})
        if(!userFindings) {
            return res.status(404).json({
                message:"The user is not been Found or this user is not present",
                success:false
            })
        }

        console.log("The transfered money is",userFindings)

        const fromAccoutn = await Account.findOne({userId:fromAccountId})

        if(!fromAccoutn || fromAccoutn.balance < Transferamount){
            return res.status(408).json({
                message:"you do not have sufficient balance in your account",
                success:false
        })
        }


        const session = await mongoose.startSession()
        session.startTransaction()
        try {

            await Account.updateOne({userId:fromAccountId},{$inc:{balance:-Transferamount}},{session},{new:true})
            await Account.updateOne({userId:toAccountId},{$inc:{balance:Transferamount}},{session},{new:true})
            
            await session.commitTransaction()
            session.endSession()
            console.log("The transferr is been succesfull")
            // console.log("The transfered money is",userFindings)
            return res.status(200).json({
                message:"The amount is been transferres",
                success:true
            })
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"There is some error from the backend",
            success:false
        })
    }
}