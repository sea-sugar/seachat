const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');
const ChatGroup = require('./chatGroup');

const ChatMessage = sequelize.define('ChatMessage', {   
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: '消息id',
  },
  sender_id: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'user_id',
    },
    allowNull: false,
    comment: '发送者id',
  },
  receiver_id: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'user_id',
    },
    allowNull: true,
    comment: '接收者id , null时为群聊消息',
},
  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: ChatGroup,
      key: 'group_id',
    },
    allowNull: true,
    comment: '接收群聊id , null时为私聊消息',
  },
  content: {
    type: DataTypes.TEXT,
    comment: '消息内容',
  },
  type: {
    type: DataTypes.ENUM('text', 'image', 'audio', 'video'),
    defaultValue: 'text',
    comment: '消息类型',
  },
  send_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '发送时间',
  },
});

module.exports = ChatMessage;