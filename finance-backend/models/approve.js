const db = require("./db");

const selectSQL = "select * from loan ";
const coditionSQL = "where status = ? "; //后加条件要,
const limitSQL = "limit ?,? ";
const orderSQL = 'order by create_time,update_time desc '
// 查询所有初审/终审人员
exports.findUser = (status,start,length) =>
  db.query(selectSQL + coditionSQL + orderSQL +limitSQL, [status, start, length]);
// 通过name查询初审/终审人员
exports.findUserByName = (name, status,start,length) =>
  db.query(selectSQL + coditionSQL + `and name like '%${name}%' ` + orderSQL +limitSQL, [
    status,
    start,
    length,
  ]);
// 查询所有人员条数
exports.findAllRows = (num) => db.query('select count(*) as total from loan where status = ?',num)
