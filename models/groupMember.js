const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const ChatGroup = require('./chatGroup');
const User = require('./user');

const GroupMember = sequelize.define('GroupMember', {
  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: ChatGroup,
      key: 'group_id',
    },
    allowNull: false,
    comment: '群聊id',
  },
  user_id: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'user_id',
    },
    allowNull: false,
    comment: '在群里的用户id',
  },
  joined_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '用户加入群聊时间',
  },
},{
  primaryKey: {
    fields: ['group_id', 'user_id']
  }
}
);

module.exports = GroupMember;