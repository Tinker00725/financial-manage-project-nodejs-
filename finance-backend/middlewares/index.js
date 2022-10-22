const {whileList} = require('../config')
const {vertifyToken, decodeToken} = require('../utils')
// 状态码：102：失败              20000：成功          603：权限有问题，需要重定向
// failed  success  tokenExpires

// exports.responseHandler = async (ctx,next) => {
//     // 失败
//     ctx.failed = (data)=>{
//         ctx.body = {
//             code:102,
//             data
//         }
//     };
//     // 权限有问题
//     ctx.tokenExpries = (data) =>{
//         ctx.body = {
//             code:603,
//             data
//         }
//     };
//     ctx.success = (data) => {
//         ctx.body = {
//             code:20000,
//             data
//         }
//     }
//     // await放行更加保险，谨防next之后还有程序执行
//     await next();
// }

// 是否token获取判断
exports.checkLogin = async (ctx,next) =>{
    // 1.是否在白名单内
    if(!whileList.includes(ctx.url)){
        let {token} = ctx.headers;
        let tokenIndex = ctx.blackTokenList.indexOf(token);
        // 2.不在白名单，验证token
        if(!vertifyToken(token)){
            // 删除确实过期的并且处于退出登录状态的token
            ctx.blackTokenList.splice(tokenIndex,1);
                return ctx.tokenExpries('无效token，请登陆后重试')
        }else{
            // 已退出用户拒绝访问页面
            if(tokenIndex !== -1){
                return ctx.tokenExpries('无效token,请登录后重试')
            }
            // 验证成功,ctx.state 挂载一个user
            ctx.state.user = decodeToken(token)
            // 挂载成功后要放通行，否则404
            await next();
        }
    }else{
        // 访问白名地址直接进入路由
       await next();
    }
}