const {
  findUserByName,
  findUsers,
  findUsersLength,
  insertUser,
  findSomebodyById,
  updateUserInfo,
  deleteLoanUser,
  findUserStatusById,
  findUserById
} = require("../models/loan");
const {List} = require('../utils/vertifyList')
const {flowStatus,waitingStaus,nonCommit} = require('../controllers/approveHelper');
// 通用鉴权，只有approve、administor有权利
exports.checkPrivelige = (type)=>{
  if(type !== 1){
    if(type !== 3){
      return ctx.failed('只有销售人员、管理员有权利操作')
    }
  }
};
// 查询
exports.getList = async (ctx) => {
  let { pageNo, pageSize, name } = ctx.query;
//   查询结果存储
  let result = null;
  // 从哪一个索引开始查询
  let start = Math.ceil((pageNo - 1) * pageSize);
  // 一页展示多少条数据
  let length = parseInt(pageSize);
  // 数据总条数
  let totalNumber = await findUsersLength();
    const {rows} = totalNumber[0];
  // 总页数
  let totalPage = Math.ceil(totalNumber / pageSize);
  if (name) {
    // 通过name模糊查询到的10条数据
    result = await findUserByName(name,start,length);
  } else {
    result = await findUsers(start,length);
  }
  ctx.success({
    pages:totalPage,
    rows,
    data:{
        data:result
    },
    size:pageSize,
  })
};

// 贷款申请创建
exports.createAccount = async ctx => {
  // 验证返回的条数有没有少，少了的话返回少了哪个
  let userInfoList = ctx.request.body;//的到的是一个对象
  for(let item in userInfoList){
    if(!List.includes(item) && item!=='remark'){
      return ctx.failed(`${item}的value暂未填写:${userInfoList[item]}`)
    }
  }
  //判断user的类型
  function choiceType (type){
    if(type !== 3) return 'admin'
    return 'system'
  }
  // 确认所有都填写了之后，插入db
  userInfoList.user_id = ctx.state.user.id;
  userInfoList.creator = choiceType(ctx.state.user.type);
  // 上面是少的两个固定参数
  let result = await insertUser(userInfoList);
  if(result.affectedRows !== 1) return ctx.failed('插入用户失败')
  ctx.success('创建成功')
}

// 更新信息
exports.updateUser = async ctx => {
  const {type} = ctx.state.user;
  // 鉴权
  exports.checkPrivelige(type);
  // 获取对应更改信息
  let {name,sex,id} = ctx.request.body;
  let updateObj = {name,sex};
  // 根据id查找到对应的信息，对比更新后更改
  let result = await findSomebodyById(id)
  let userInfo = result[0];
  if(name !== userInfo.name || sex !== userInfo.sex){
    let updateResult = await updateUserInfo(updateObj,id);
    if(updateResult.affectedRows !== 1) return ctx.failed('更新失败')
    return ctx.success('更新成功')
  }
  ctx.failed('请更改用户信息')
}

// 删除用户信息
exports.delteLoan = async ctx =>{
  // 首先鉴权
  const {type} = ctx.state.user;
  exports.checkPrivelige(type);
  let {delId} = ctx.params;
  console.log(delId)
  let delResult = await deleteLoanUser(delId)
  if(delResult.affectedRows !== 1) return ctx.failed('删除失败');
  ctx.success('删除成功')
} 

// 提交审核
exports.submiToApprove = async ctx => {
  // 获取id
  let {id} = ctx.request.body;
  // 根据id查找相应status
  let result = await findUserStatusById(id);
  if(result.length !== 1) return ctx.failed('当前申请不存在');
  let {status} = result[0];
  if([...nonCommit,...waitingStaus].includes(status)){
    return ctx.failed('当前流程不能继续提交')
  }
  let currentStatus = flowStatus[status];
  currentStatus = currentStatus.pass || currentStatus;
  //插入更改之后的status
  let updateResult = await updateUserInfo({status:currentStatus.v},id)
  if(updateResult.affectedRows !== 1) return ctx.failed('提交审核失败')

  return ctx.success({
    info:'提交成功',
    from:status,
    to:currentStatus.v
  })
}

// 查看详情
exports.getDetail = async ctx => {
  // 1.鉴权
  const {type} = ctx.state.user;
  exports.checkPrivelige(type);
  // 2.获取参数查询db
  const {id} = ctx.query;
  let detailRes = await findUserById(id);
  if(detailRes.length !==1 )return ctx.failed('查询用户失败');
  // 3.返回查询结果
  ctx.success({
    info:'获取成功',
    data:detailRes[0],
  })
}