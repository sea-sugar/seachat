const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ChatMessage = require('../models/chatMessage');
const ChatGroup = require('../models/chatGroup');
const { createToken } = require('../utils/jwt');
const { Op } = require('sequelize');

const PAGE_SIZE = 10; // 每页消息数量

// 返回用户聊天信息
router.get('/getMessage', async (req, res) => {
    const { groupId, receiverId, page = 1 } = req.query; // 添加页码的查询参数
    // console.log(groupId, receiverId);
    if ((groupId == '' && receiverId == '') || (groupId !== '' && receiverId !== '')) {
        return res.error(404, '错误的聊天记录');
    }

    let totalMessages = 0;
    let messages = null;

    try {
        if (receiverId !== '') { // 私聊消息
            totalMessages = await ChatMessage.count({
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
            });
        } else { // 群聊消息
            totalMessages = await ChatMessage.count({
                where: { group_id: groupId },
            });
        }

        if (totalMessages === 0) {
            return res.success(200, 'success', { messages: [], totalMessages: 0 });
        }

        const totalPages = Math.ceil(totalMessages / PAGE_SIZE);

        if (page > totalPages) { // 如果请求的页码超过总页数，返回空数组
            return res.success(200, 'success', { messages: [], totalMessages: totalMessages });
        }

        const offset = (page - 1) * PAGE_SIZE; // 计算偏移量

        if (receiverId !== '') { // 私聊消息
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
                attributes: ['sender_id', 'receiver_id', 'group_id', 'content', 'type', 'send_time'],
                order: [['send_time', 'ASC']], // 按照发送时间升序排列
                include: [
                    { model: User, as: 'sender', attributes: ['user_id', 'username', 'user_avatar'] }, // 关联发送者信息
                    { model: User, as: 'receiver', attributes: ['user_id', 'username', 'user_avatar'] }, // 关联接收者信息
                ],
                limit: PAGE_SIZE, // 每页消息数量
                offset: offset // 偏移量
            });
        } else { // 群聊消息
            messages = await ChatMessage.findAll({
                where: { group_id: groupId },
                order: [['send_time', 'ASC']], // 按照发送时间升序排列
                attributes: ['sender_id', 'receiver_id', 'group_id', 'content', 'type', 'send_time'],
                include: [
                    { model: User, as: 'sender', attributes: ['user_id', 'username', 'user_avatar'] }, // 关联发送者信息
                    { model: ChatGroup, as: 'group', attributes: ['group_id', 'group_name', 'group_avatar', 'description'] } // 关联群聊信息
                ],
                limit: PAGE_SIZE, // 每页消息数量
                offset: offset // 偏移量
            });
        }

        res.success(200, 'success', { messages, totalMessages });
        console.log("用户 id: ", res.userinfo.user_id, " 获取消息成功");
    } catch (error) {
        console.error(error);
        return res.error(500, 'Internal Server Error');
    }
});


// 返回用户最后一条聊天信息
router.get('/getLastMessage', async (req, res) => {
    const { groupId, receiverId } = req.query;
    // console.log(groupId, receiverId);
    if ((groupId == '' && receiverId == '')||(groupId !== '' && receiverId !== '')) {
        return res.error(404, '错误的聊天记录');
    }
    let message = null ;
    if (receiverId !== '') { //私聊消息
        try {
            message = await ChatMessage.findOne({
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
                order: [['send_time', 'DESC']], // 按照发送时间升序排列
                include: [
                    { model: User, as: 'sender', attributes: ['user_id', 'username', 'user_avatar'] }, // 关联发送者信息
                    { model: User, as: 'receiver', attributes: ['user_id', 'username', 'user_avatar'] }, // 关联接收者信息
                  ]
            });
        } catch (error) {
            console.error(error);
            return res.error(500, 'Internal Server Error');
        }
    } else { //群聊消息
        try {
            message = await ChatMessage.findOne({
                where: {group_id: groupId},
                order: [['send_time', 'DESC']], // 按照发送时间升序排列
                attributes: ['sender_id', 'receiver_id', 'group_id', 'content','type','send_time'],
                include: [
                    { model: User, as: 'sender', attributes: ['user_id', 'username', 'user_avatar'] }, // 关联发送者信息
                    { model: ChatGroup, as: 'group', attributes: ['group_id', 'group_name', 'group_avatar', 'description'] } // 关联群聊信息
                  ]
            });
        } catch (error) {
            console.error(error);
            return res.error(500, 'Internal Server Error');
        }
    }
    res.success(200, 'success', { message });
    console.log("用户 id: ",res.userinfo.user_id ," 获取消息成功" );
});

module.exports = router;
