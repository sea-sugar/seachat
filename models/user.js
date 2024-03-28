const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    comment: '用户id',
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户名称',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户密码',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户邮箱',
  },
  user_avatar: {
    type: DataTypes.STRING,
    defaultValue : '1',
    comment: '用户头像',
  },
  status: {
    type: DataTypes.ENUM('online', 'offline'),
    defaultValue: 'offline',
    comment: '用户在线状态 online在线 offline离线',
  },
  created_time: {
    type : DataTypes.DATE,
    allowNull: false,
    comment: '用户建立时间',
  }
});

module.exports = User;