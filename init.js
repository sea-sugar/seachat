const sequelize = require('./utils/database');
const User = require('./models/user');
const UserFriend = require('./models/userFriend');
const GroupMember = require('./models/groupMember');
const ChatMessage = require('./models/chatMessage');
const ChatGroup = require('./models/chatGroup');

// 同步所有模型
sequelize.sync({ force: true })
  .then(() => {
    console.log('数据库同步完成');
    // 可选: 在这里初始化数据
    return initData();
  })
  .catch(err => console.error('数据库同步失败:', err));

async function initData() {
  // 如果表已存在,将会先删除后重新创建
  await User.bulkCreate([ 
    { user_id : 123456 , username: 'admin', password: '123456', email: 'admin@qq.com', user_avatar : '1',status : 'offline',created_time: new Date() },
    { user_id : 654321 , username: 'test', password: '123456', email: 'test@qq.com', user_avatar : '1',status : 'offline',created_time: new Date() },
  ]);

  await UserFriend.bulkCreate([
    { user_id: 123456, friend_id: 654321, created_time: new Date() },
  ]);
  
  await ChatGroup.bulkCreate([
    { group_id : 123, group_name: 'qunliao123', description: '123', owner_id: 123456 ,created_time: new Date() ,group_avatar: '1'  },
    { group_id : 234, group_name: 'qunliao234', description: '234', owner_id: 123456 ,created_time: new Date() ,group_avatar: '1'  },
  ]);

  await GroupMember.bulkCreate([
    { group_id : 123,  user_id: 123456 ,joined_time: new Date() , },
    { group_id : 123,  user_id: 654321 ,joined_time: new Date() , },
  ]);

  await ChatMessage.bulkCreate([
    { sender_id: 123456, receiver_id: 654321,group_id:null,content:'私聊',type: 'text' ,send_time:new Date()},
    { sender_id: 123456, receiver_id: null,group_id:123,content:'群聊',type: 'text' ,send_time:new Date()},
  ]);


}