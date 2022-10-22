const db = require('./db');

// 通过account查找mysql
exports.findUserByAccount = (account)=>db.query('select * from user where account = ?',[account])
// 通过id查找mysql
exports.findUserById = id => db.query('select * from user where id = ?',[id])
// 通过创建时间由新到旧查询所有信息
exports.queryAllByReg_time = () =>db.query('select account,creator,password,reg_time,role_name from user order by reg_time desc')
// 加入用户数据
exports.insertUser = (obj) => db.query('insert into user set ?',obj)