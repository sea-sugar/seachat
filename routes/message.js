const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ChatMessage = require('../models/chatMessage');
const { createToken } = require('../utils/jwt');
const { Op } = require('sequelize');

// 返回用户聊天信息
router.get('/getMessage', async (req, res) => {
    const { groupId, receiverId } = req.query;
    console.log(groupId, receiverId);
    if ((groupId == '' && receiverId == '')||(groupId !== '' && receiverId !== '')) {
        return res.error(404, '错误的聊天记录');
    }
    let messages = null ;
    if (receiverId !== '') { //私聊消息
        try {
            messages = await ChatMessage.findAll({
                where: {
                    [Op.or]: [
                        {
                            sender_id: res.userinfo.user_id,
                            receiver_id: receiverId,
                        },
                        {
                            sender_id: receiverId,
                            receiver_id: res.userinfo.user_id,
                        },
                    ],
                },
                attributes: ['sender_id', 'receiver_id', 'group_id', 'content','type','send_time'],
                order: [['send_time', 'ASC']], // 按照发送时间升序排列
            });
        } catch (error) {
            console.error(error);
            return res.error(500, 'Internal Server Error');
        }
    } else { //群聊消息
        try {
            messages = await ChatMessage.findAll({
                where: {group_id: groupId},
                order: [['send_time', 'ASC']], // 按照发送时间升序排列
                attributes: ['sender_id', 'receiver_id', 'group_id', 'content','type','send_time'],
            });
        } catch (error) {
            console.error(error);
            return res.error(500, 'Internal Server Error');
        }
    }
    res.success(200, 'success', { messages });
    console.log("用户 id: ",res.userinfo.user_id ," 获取消息成功", messages );
});

module.exports = router;
