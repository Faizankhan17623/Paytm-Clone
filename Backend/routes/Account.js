const express = require('express')
const Routes = express.Router()
const {CreateBalance,getTotalBalance,TransferMoney} = require('../controllers/Acounts')
const {Auth}  = require('../middlewares/middle')
Routes.post('/Deposit',Auth,CreateBalance)
Routes.get('/TotalBalance',Auth,getTotalBalance)
Routes.post('/TransferMoney',Auth,TransferMoney)
module.exports = Routes

