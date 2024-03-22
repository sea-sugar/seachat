### sea sugar 在线聊天网站

------

建立一个基于express、mysql的在线聊天网站，要有用户信息，用户好友，聊天群聊，聊天信息，后端架构设计设计，表模型定义，数据库连接，http请求统一中间件处理。

------

###### 下载安装

```bash
## 克隆项目源码包
git clone https://github.com/gzydong/LumenIM.git

## 安装项目依赖扩展组件
npm install

# 初始化数据库
npm run init

# 启动本地开发环境
npm run dev


```



###### 一、mysql表结构设计

1. 用户信息表（users）：

   - username（用户名）

   - user_id (用户id)

   - password（密码）

   - email（邮箱）

   - user_avatar（头像URL）

   - status（在线状态）

   - created_time（创建时间）

     

2. 用户好友表（user_friends）：

   - user_id（用户ID）

   - friend_id（好友ID）

   - created_time（创建时间）

     

3. 群聊表（chat_groups）：

   - group_id（群聊id）

   - group_name（群聊名称）

   - description（群聊描述）

   - owner_id（群主ID，外键关联users表）

   - created_time（创建时间）

   - group_avatar （群聊头像）

     

4. 群聊成员表（group_members）：

   - group_id（群聊ID，外键关联chat_groups表）
   - user_id（用户ID，外键关联users表）
   - joined_time（加入时间）
   - 

5. 聊天信息表（chat_messages）：

   - sender_id（发送者ID）
   - receiver_id（接收者ID，如果是群聊则为NULL）
   - group_id（群聊ID，如果是私聊则为NULL）
   - content（消息内容）
   - type（消息类型，如文本、图片、文件等）
   - send_time（发送时间）
   - message_id （消息id）

   

   

###### 二、测试数据库连接，初始化数据库

   

```js
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
```

###### 三、http请求统一中间件处理

```js
const responseMiddleware = (req, res, next) => {
  // 封装 res.success 方法
  res.success = (code = 200, msg = 'success', data) => {
    res.status(code).json({
      code,
      msg,
      data
    });
  };

  // 封装 res.error 方法
  res.error = (code = 400, msg) => {
    res.status(code).json({
      code,
      msg
    });
  };

  next();
};

module.exports = responseMiddleware;
```

