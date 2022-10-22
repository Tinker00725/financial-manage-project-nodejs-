// 方便查询db配置信息
exports.db = {
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'approve',
    password        : 'approve123456_',
    database        : 'approve'
  }

// token密钥
exports.secretKey = 'Tinker00724'
// token有效期（s）
exports.tokenExpires = 600;
// 免token验证的请求地址
exports.whileList = ['/user/login','/user/logout']  