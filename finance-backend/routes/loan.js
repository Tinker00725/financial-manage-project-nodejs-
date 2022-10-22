const router = require('koa-router')();
const {getList,createAccount,updateUser,delteLoan,submiToApprove,getDetail} = require('../controllers/loan')

router.prefix('/loan')
.get('/list', getList)
.post('/create',createAccount)
.put('/update',updateUser)
.delete('/delete/:delId',delteLoan)
.post('/submitToApprove',submiToApprove)
.get('/query',getDetail)
module.exports = router;