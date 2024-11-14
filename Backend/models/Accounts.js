const mongoose = require('mongoose')

const BackSchema = new mongoose.Schema({
    userId:{
       type: mongoose.Types.ObjectId,
    ref:'User',
    require:true,
    },
    balance:{
        type:Number,
        require:true,
        default:0
    },
})


module.exports = mongoose.model("Payments",BackSchema)