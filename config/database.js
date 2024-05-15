// 部署用
// module.exports = {
//   host: process.env.DATABASE_HOST || '192.168.0.232',
//   port: process.env.DATABASE_PORT || 3306,
//   username: process.env.DATABASE_USER || 'root',
//   password: process.env.DATABASE_PASSWORD || '123456',
//   database: process.env.DATABASE_NAME || 'webchat',
//   dialect: 'mysql',
// };

// 配置数据库连接信息 本地用
module.exports = {
  host: 'localhost',
  port:  3306,
  username: 'root',
  password: '123456',
  database: 'webchat',
  dialect: 'mysql',
};