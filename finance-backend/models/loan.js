const db = require("./db");

const selcet = "select * from loan ";
const orderBy = "order by create_time,update_time desc ";
const limit = "limit ?,?";

// 通过name模糊查询
exports.findUserByName = (name, start, length) =>
  db.query(selcet + `where name like '%${name}%' ` + orderBy + limit, [
    start,
    length,
  ]);

// 直接查询结果
exports.findUsers = (start, length) =>
  db.query(selcet + orderBy + limit, [start, length]);

// 查询总条数
exports.findUsersLength = () => db.query("select count(*) from loan");

// 插入对应的新建用户
exports.insertUser = (userInfo) => db.query('insert into loan set ?',userInfo)

// 根据id查找对应的更新信息用户
exports.findSomebodyById = (id) => db.query('select name,sex from loan where id = ?',id)

// 更新用户的信息
exports.updateUserInfo = (info,id) => db.query('update loan set ? ,update_time = now() where id = ?',[info,id])

// 根据id删除用户信息
exports.deleteLoanUser = (id) => db.query('delete from loan where id = ?',id)

// 通过id查询用户信息的status
exports.findUserStatusById = (id) => db.query('select status from loan where id = ?',[id])

// 通过id查询用户全部信息
exports.findUserById = (id) => db.query('select * from loan where id = ?',id)

// 通过name查询status=5||7的数据
exports.findUserByNameStatusIn = (name,in1,in2,start,length) => db.query(`select * from loan where name like '%${name}%' and status in (?,?) limit ?,?`,[in1,in2,start,length])
// 通过name查询status=5||7的条数
exports.countUserBynameStatusIn = (name,in1,in2) => db.query(`select count(*) as total from loan where name like '%${name}%' and status in (?,?) `,[in1,in2])
// 查询status=5||7的数据
exports.findUserStatusIn = (in1,in2,start,length) => db.query('select * from loan where status in (?,?) limit ?,?',[in1,in2,start,length])
// 查询status=5||7的条数
exports.countUserStatusIn = (in1,in2) => db.query('select count(*) from loan as total where status in (?,?) ',[in1,in2])
