const mysql = require('mysql');
const {db} = require('../config');
const pool  = mysql.createPool(db);

// 封装query，便于异步
exports.query = function(sql,params=[]){
    return new Promise((resolve,reject)=>{
        pool.getConnection(function(err, connection) {
            
            if (err) throw err; // not connected!
            
            // Use the connection
            connection.query(sql,params,function (error, results, fields) {
                // 调试的小技巧
                console.log(`${sql}==>${params}==信息=>${results}`)
              // When done with the connection, release it.
              connection.release();
           
              // Handle error after the release.
              if (error) {
                console.log('db出现错误')
                return reject(error)
              };
                resolve(results)
              // Don't use the connection here, it has been returned to the pool.
            });
          })
    })

}