const { verifyToken , refreshToken} = require('../utils/jwt');

const WhiteList = ['/login','/logout','/register']
const authMiddleware = (req, res, next) =>{
  // 从请求头中获取 token
  const authorizationHeader = req.headers['authorization'];
  const token = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
  // 如果在白名单直接放行
  if (WhiteList.includes(req.path) ) {
    next();
  }
  else{
    // 如果 token 不存在，返回 401 错误
    if (!token) {
      return res.error(401,'认证失败!，无法访问系统资源');
    }

    // 验证 token 的有效性
    const decodedToken = verifyToken(token);

    // 如果 token 无效，返回 401 错误
    if (!decodedToken) {
      return res.error(401,'认证失败，无法访问系统资源');
    }

    // 将解码后的用户信息存储到请求对象中
    req.userinfo = decodedToken;

    // 在响应对象中添加用户信息属性
    res.userinfo = decodedToken;

    // 如果 token 即将过期，则刷新 token
    // const refreshedToken = refreshToken(token);
    
    // 将刷新后的 token 放入响应头中
    // res.setHeader('Authorization', refreshedToken);

    // 继续执行后续的请求处理
    next(); 
  }
}

module.exports = authMiddleware;
