const {findUser,findUserByName,findAllRows} = require('../models/approve');
const { findUserStatusById,updateUserInfo } = require('../models/loan');
const { flowStatus } = require('./approveHelper');

function getList (num){
    return async ctx =>{
        let {pageNo,pageSize,name} = ctx.query;
        let start = parseInt((pageNo - 1) * pageSize);
        let length = +pageSize;
        if(name){
            let nameResult = await findUserByName(name,num,start,length);
            let rows = await findAllRows(num);
            let pages = Math.ceil(rows / pageSize);
            return ctx.success({
                pages,
                rows,
                data:{
                    data:nameResult,
                }
            })
        }
        let searchResult = await findUser(num,start,length);
        let lengthRes = await findAllRows(num);//总条数
        let rows = lengthRes[0].total;
        let pages = Math.ceil(rows / pageSize);//总页数
        ctx.success({
            pages,
            rows,
            data:{
                data:searchResult,
            },
        })
    }
}

function doApprove(isPassed){
    return async ctx  => {
        // 1.鉴权操作（admin与administor有权限）
        let { type } = ctx.state.user;
        if(type !== 3 && type !== 1) return ctx.failed('操作失败，只有管理员与审核员有操作权限');
        // 2.确定有操作权限后，获取参数,查询状态
        const id = ctx.request.body.appId || ctx.request.body.loanId;
        let statusRes = await findUserStatusById(id);
        if(statusRes.length !== 1) return ctx.failed('查询失败,用户不存在');
        const originStatus = statusRes[0].status;
        //3.状态+1
        const choiceStatus = flowStatus[originStatus]
        const currentStatus = choiceStatus[isPassed?'pass':'reject'];//链表的动态属性使用
        if(currentStatus.v == choiceStatus.v) return ctx.failed('审批状态未发生改变');
        // 4.更新status到数据库
        let updateRes = await updateUserInfo({status:currentStatus.v},id);
        if(updateRes.affectedRows !== 1) return ctx.failed('更新用户status失败');
        // 5.返回状态
        ctx.success('更新成功')
    }
}
exports.approve = {
    first:{},
    end:{},
}

exports.approve.first.pass = exports.approve.end.pass = doApprove(true);
exports.approve.first.reject = exports.approve.end.reject = doApprove(false);

exports.getFirstList = getList(1);

exports.getEndList = getList(4);