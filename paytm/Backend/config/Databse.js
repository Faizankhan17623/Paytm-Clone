const mongoose = require('mongoose')
const Database_Connection = async()=>{
    mongoose.connect(process.env.DATABASE_CONNNECTION_URL)
    .then(()=>{
        console.log("This is the databse connection is been done")
    })
    .catch((error)=>{
        console.log("THis is the error message",error)
        console.log(error.message)
    })
}

module.exports = Database_Connection;