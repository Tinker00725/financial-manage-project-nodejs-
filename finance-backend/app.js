const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const user = require('./routes/user')
const permission = require('./routes/permission')
const loan = require('./routes/loan')
const approve = require('./routes/approve')
const contract = require('./routes/contract')

const {responseHandler,checkLogin} = require('./middlewares')

// 全局退出黑名单
// var的提升，不用var直接声明全局global
// 或者直接挂载到ctx身上
app.context.blackTokenList = []

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 配置response中间件，便于后端写复用、规范写响应
// app.use(responseHandler)
// 提高性能，将返回方法挂载到ctx上，不用每次加载
app.context.success = function(data){
  this.body = {
    code:20000,
    data
  }
}
app.context.failed = function(data){
  this.body = {
    code:102,
    data
  }
}
app.context.tokenExpries = function(data){
  this.body = {
    code:603,
    data
  }
}
// token判断
app.use(checkLogin)

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(permission.routes(),permission.allowedMethods())
app.use(loan.routes(),loan.allowedMethods())
app.use(approve.routes(),approve.allowedMethods())
app.use(contract.routes(),contract.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
