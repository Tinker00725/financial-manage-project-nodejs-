const {
  findUserByAccount,
  findUserById,
  queryAllByReg_time,
  insertUser,
} = require("../models/user");
const {
  createToken,
  vertifyToken,
  decodeToken,
  whileList,
} = require("../utils");
// 登录
exports.dologin = async (ctx) => {
  let { account, password } = ctx.request.body;
  // 账号密码为空（control层）
  if (!account || !password) {
    // ctx.body = '请填写账号或密码';
    ctx.failed("请填写账号或密码");
    return;
  }
  // 通过账号查询数据库(model层)
  const result = await findUserByAccount(account);
  if (result.length !== 1) {
    // return ctx.body = '用户名或密码不正确'
    return ctx.failed("用户名或密码不正确"); //为了防止暴力破解账户所以说两个
  }
  // 对比得到的password是否一致
  let user = result[0];
  if (user.password !== password) {
    // return ctx.body = '用户名或密码不正确'
    return ctx.failed("用户名或密码不正确");
  }
  //token里的用户信息
  let userObj = {
    id: user.id,
    account: user.account,
    type: user.role_id,//就是数字321
  };
  let token = createToken(userObj);
  // 登录成功（view层）,发送token
  // ctx.body = '登录成功'
  ctx.success({ token });
};

// 获取用户信息
exports.getInfo = async (ctx) => {
  // token验证成功，ctx.state.user里是共享数据
  //   token里面的用户信息解析失败
  if (!ctx.state.user) return ctx.success("用户信息获取失败");
  let result = await findUserById(ctx.state.user.id);
  let dbUser = result[0];
  //   通过token中信息在数据库中查找不到
  if (!dbUser) {
    return ctx.failed("用户信息不存在");
  }
  //   查找到了
  ctx.success({
    info: "获取成功",
    roles: [{ name: dbUser.role_name }],
  });
};

// 登出
exports.doLogout = async (ctx) => {
  // token派发以后不能消除，加到全局黑名单表示退出
  let { token } = ctx.headers;
  ctx.blackTokenList.push(token);
  console.log(global.blackTokenList);
  ctx.success("用户已退出");
};

// 查询用户列表
exports.queryList = async (ctx) => {
  const result = await queryAllByReg_time();
  ctx.success(result);
};

// 创建管理员
exports.createUser = async (ctx) => {
  let {type} = ctx.state.user;
  // 只有system可以创建管理员
  if(type !== 3) return ctx.failed('对不起，您没有创建用户的权力')
  // 获取前端发送的账号密码与创建类型
  let { account, password, role_id } = ctx.request.body;
  let role_name = null;
  role_name = role_id == 1 ? "approve" : role_id == 2 ? "input" : "";
  // 集合信息
  let inserObj = {
    creator: "admin",
    account,
    password,
    role_id,
    role_name,
  };
  // 插入
  let result = await insertUser(inserObj);
  if (result.affectedRows !== 1) return ctx.failed("创建管理员失败");
  ctx.success("插入管理员成功");
};
