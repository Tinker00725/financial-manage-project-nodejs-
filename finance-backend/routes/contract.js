const router = require('koa-router')();
const {getUser,createFile,download, downloadFile} = require('../controllers/contract')

router.prefix('/contract')
.get('/list',getUser)
.post('/createFile',createFile)
.get('/download',download)
.get('/download/:fileName',downloadFile)
module.exports = router;