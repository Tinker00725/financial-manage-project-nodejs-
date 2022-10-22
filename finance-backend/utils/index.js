const jwt = require('jsonwebtoken');
// 密钥较为重要从外部引入
const {secretKey,tokenExpires} = require('../config')

// 创建token
exports.createToken = (user) =>{
    var token = jwt.sign(user, secretKey,{expiresIn:tokenExpires});
    return token;
}

// 验证token
exports.vertifyToken = (token)=>{
    try{
        var result = jwt.verify(token,secretKey)
    }catch(e){}finally{
        return result;
    }
}

// 解码token
exports.decodeToken = (token) =>{
    return jwt.decode(token,secretKey);

}


const fs = require('fs')

// 判断文件合同是否存在
exports.isExist = filePath => {
    try{
        fs.accessSync(filePath);
        return true;
    }catch(e){
        return false;
    }
}