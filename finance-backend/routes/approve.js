const router = require('koa-router')();
const {getFirstList,getEndList,approve} = require('../controllers/approve')

router.prefix('/approve')
.get('/first/list', getFirstList)
.get('/end/list',getEndList)
.post('/first/pass',approve.first.pass)
.post('/first/reject',approve.first.reject)
.post('/end/pass',approve.end.pass)
.post('/end/reject',approve.end.reject)

module.exports = router;