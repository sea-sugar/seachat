const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');

const ChatGroup = sequelize.define('ChatGroup', {
  group_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '群聊id',
  },
  group_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '群聊昵称',
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '群聊描述',
  },
  owner_id: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'user_id',
    },
    allowNull: false,
    comment: '群主id',
  },
  created_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '群聊创建时间',
  },
  group_avatar: {
    type: DataTypes.STRING,
    comment: '群聊头像',
  },
});

module.exports = ChatGroup;