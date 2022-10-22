const router = require('koa-router')()
const {dologin,getInfo,doLogout,queryList} = require('../controllers/user')

router.prefix('/user')
.post('/login',dologin)
.get('/info',getInfo)
.post('/logout',doLogout)
.get('/list',queryList)
module.exports = router
