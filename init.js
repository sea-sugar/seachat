const sequelize = require('./utils/database');
const User = require('./models/user');
const UserFriend = require('./models/userFriend');
const GroupMember = require('./models/groupMember');
const ChatMessage = require('./models/chatMessage');
const ChatGroup = require('./models/chatGroup');
const mysql = require('mysql2/promise'); // 引入 MySQL2 库
const config = require('./config/database'); // 导入数据库配置
// 创建数据库
async function createDatabase() {
  try {
   
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
    console.log(`创建数据库 ${config.database} 成功`);
  } catch (error) {
    console.error(`创建数据库 ${config.database} 失败`, error);
  }
}

// 创建数据库，然后执行初始化数据
createDatabase()
  .then(() => {
    // 同步所有模型
    sequelize.sync({ force: true })
      .then(() => {
        console.log('数据库同步完成');
        // 可选: 在这里初始化数据
        return initData();
      })
      .catch(err => console.error('数据库同步失败:', err));
  }).catch(err =>{
    console.error('数据库创建失败:', err)
  });

async function initData() {
  // 如果表已存在,将会先删除后重新创建
  await User.bulkCreate([ 
    { user_id : 'admin' , username: 'admin', password: '123456', email: 'admin@qq.com', user_avatar : '/1.png',status : 'offline',created_time: new Date() },
    { user_id : 'test' , username: 'test', password: '123456', email: 'test@qq.com', user_avatar : '/2.png',status : 'offline',created_time: new Date() },
    { user_id : 'pineapple' , username: 'pineapple', password: '123456', email: 'pineapple@qq.com', user_avatar : '/3.png',status : 'offline',created_time: new Date() },
    { user_id : 'bread' , username: 'bread', password: '123456', email: 'bread@qq.com', user_avatar : '/4.png',status : 'offline',created_time: new Date() },
    { user_id : 'dorayaki' , username: 'dorayaki', password: '123456', email: 'dorayaki@qq.com', user_avatar : '/5.png',status : 'offline',created_time: new Date() },
  ]);

  await UserFriend.bulkCreate([
    { user_id: 'admin', friend_id: 'test', created_time: new Date() },
    { user_id: 'pineapple', friend_id: 'admin', created_time: new Date() },
    { user_id: 'pineapple', friend_id: 'bread', created_time: new Date() },
    { user_id: 'bread', friend_id: 'dorayaki', created_time: new Date() },
    { user_id: 'bread', friend_id: 'admin', created_time: new Date() },
    { user_id: 'dorayaki', friend_id: 'admin', created_time: new Date() },
    { user_id: 'dorayaki', friend_id: 'pineapple', created_time: new Date() },
  ]);
  
  await ChatGroup.bulkCreate([
    { group_name: 'A Group', description: 'Pineapple Bread Dorayaki', owner_id: 'admin' ,created_time: new Date() ,group_avatar: '/6.png'  },
  ]);

  await GroupMember.bulkCreate([
    { group_id : 1,  user_id: 'admin' ,joined_time: new Date() , },
    { group_id : 1,  user_id: 'test' ,joined_time: new Date() , },
    { group_id : 1,  user_id: 'pineapple' ,joined_time: new Date() , },
    { group_id : 1,  user_id: 'bread' ,joined_time: new Date() , },
    { group_id : 1,  user_id: 'dorayaki' ,joined_time: new Date() , },
  ]);

  await ChatMessage.bulkCreate([
    { sender_id: 'admin', receiver_id: 'test',group_id: null ,content:'私聊',type: 'text' ,send_time:new Date()},
    { sender_id: 'admin', receiver_id: null,group_id: 1 ,content:'A Group Time',type: 'text' ,send_time:new Date()},
    { sender_id: 'admin', receiver_id: 'pineapple',group_id: null ,content:'我是admin',type: 'text' ,send_time:new Date()},
    { sender_id: 'admin', receiver_id: 'bread',group_id: null ,content:'我是admin',type: 'text' ,send_time:new Date()},
    { sender_id: 'admin', receiver_id: 'dorayaki',group_id: null ,content:'我是admin',type: 'text' ,send_time:new Date()},

    { sender_id: 'pineapple', receiver_id: 'bread',group_id: null ,content:'我是菠萝',type: 'text' ,send_time:new Date()},
    { sender_id: 'pineapple', receiver_id: 'admin',group_id: null ,content:'我是菠萝',type: 'text' ,send_time:new Date()},
    { sender_id: 'pineapple', receiver_id: 'dorayaki',group_id: null ,content:'我是菠萝',type: 'text' ,send_time:new Date()},

    { sender_id: 'bread', receiver_id: 'admin',group_id: null ,content:'我是面包',type: 'text' ,send_time:new Date()},
    { sender_id: 'bread', receiver_id: 'dorayaki',group_id: null ,content:'我是面包',type: 'text' ,send_time:new Date()},
    { sender_id: 'bread', receiver_id: 'pineapple',group_id: null ,content:'我是面包',type: 'text' ,send_time:new Date()},

    { sender_id: 'dorayaki', receiver_id: 'pineapple',group_id: null ,content:'我是铜锣烧',type: 'text' ,send_time:new Date()},
    { sender_id: 'dorayaki', receiver_id: 'admin',group_id: null ,content:'我是铜锣烧',type: 'text' ,send_time:new Date()},
    { sender_id: 'dorayaki', receiver_id: 'bread',group_id: null ,content:'我是铜锣烧',type: 'text' ,send_time:new Date()},

    { sender_id: 'admin', receiver_id: null,group_id: 1 ,content:'我是admin',type: 'text' ,send_time:new Date()},
    { sender_id: 'pineapple', receiver_id: null,group_id: 1 ,content:'我是菠萝',type: 'text' ,send_time:new Date()},
    { sender_id: 'bread', receiver_id: null,group_id: 1 ,content:'我是面包',type: 'text' ,send_time:new Date()},
    { sender_id: 'dorayaki', receiver_id: null,group_id: 1 ,content:'我是铜锣烧',type: 'text' ,send_time:new Date()},
  ]);
  console.log('数据库初始化完成，即将退出进程');
  process.exit(0);
}