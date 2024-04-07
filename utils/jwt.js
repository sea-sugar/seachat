const jwt = require('jsonwebtoken');

// 定义密钥
const secretKey = 'balala';
const expiresIn =  60 * 60
// const expiresIn = 30 * 24 * 60 * 60; // 30天

// 生成 token
const createToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: expiresIn });
}

// 验证 token
const verifyToken = (token) =>{
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

// 刷新 token
const refreshToken = (token) =>{
    const decodedToken = jwt.decode(token);
  
    if (decodedToken && decodedToken.exp - Date.now() / 1000 < 600) {
      // 如果 token 的有效期不足 10 分钟，则刷新 token
      const payload = { username: decodedToken.username, role: decodedToken.role };
      return generateToken(payload);
    }
  
    return token;
}

module.exports = {
    createToken,
    verifyToken,
    refreshToken
}

