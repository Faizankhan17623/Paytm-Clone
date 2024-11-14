const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const Port = process.env.PORT || 5173;
const db_connection = require('./config/Databse')
const Profile = require('./routes/Profile')
const Account = require('./routes/Account')
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))


app.use('/api/v1/Profile',Profile)
app.use('/api/v1/Transactions',Account)

app.get('/',(req,res)=>{
    return res.status(200).json({
        message:"THis is the default Route",
        success:true
    })
})
db_connection()

app.listen(Port,()=>{
    console.log(`THis is the default Route number ${Port}`)
})
