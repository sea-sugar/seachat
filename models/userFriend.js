const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./user');

const UserFriend = sequelize.define('UserFriend', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
    allowNull: false,
    comment: '用户id',
  },
  friend_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
    allowNull: false,
    comment: '用户好友id',
  },
  created_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '好友建立时间',
  },
},{
    primaryKeys: true,
    uniqueKeys: {
      unique_user_friend: {
        fields: ['user_id', 'friend_id']
      }
    }
});

module.exports = UserFriend;