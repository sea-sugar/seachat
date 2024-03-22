const sequelize = require('./utils/database');

// 测试数据库连接
async function testConnection() {
  try {
    // 尝试连接数据库
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 调用测试连接函数
testConnection();