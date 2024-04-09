const socketIo = require('socket.io');
const { verifyToken }  = require('./jwt');
const chatMessage = require('../models/chatMessage')
const User = require('../models/user')
const ChatGroup = require('../models/chatGroup')

module.exports = function initSocket(server) {
    const io = socketIo(server, {
        allowEIO3: true,
        cors: {
          origins: ['http://localhost:8080', 'http://localhost:8082', '*'],
          methods: ["GET", "POST"],
          credentials: true
        }
      });
      
    // 监听连接事件
    io.on('connection', socket => {
        const token = socket.handshake.query.token;
        // 如果 token 不存在，返回 401 错误
        if (!token) {
            console.log(`${new Date().toLocaleString()} 未提供token，拒绝连接`);
            // 返回认证失败信息给客户端
            socket.emit('authError', { message: 'Token 验证失败，拒绝连接' });
            socket.disconnect(true);
            return;
        }
        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            // 返回认证失败信息给客户端
            console.log(`${new Date().toLocaleString()} token错误拒绝连接`);
            socket.emit('authError', { message: 'Token 验证失败，拒绝连接' });
            socket.disconnect(true);
            return;
        }
        console.log(`${new Date().toLocaleString()} 用户 ${decodedToken.username} 已连接 `);
        socket.on('message', function (data) {
            console.log(`${new Date().toLocaleString()} 接收到用户 ${decodedToken.username} message 消息 :`, data);
            // socket.send('你好客户端, ' + data);
        });
     
        socket.on('sendMessage', async function (data) {
            console.log(`${new Date().toLocaleString()} 接收到用户 ${decodedToken.username} sendmessage 给${data.receiver_id ? `用户 ${data.receiver_id} ` : ` 群聊 ${data.group_id}` } 消息 :`, data.content);
            let receiveData = null ;
            let Info = null ;
            if (data.receiver_id !== undefined) {
                receiveData = await chatMessage.create({
                    sender_id: decodedToken.user_id,
                    receiver_id: data.receiver_id,
                    content: data.content,
                    type:data.type,
                },{
                include: [
                    { model: User, as: 'sender', attributes: ['user_id', 'username', 'user_avatar'] }, // 关联发送者信息
                    { model: User, as: 'receiver', attributes: ['user_id', 'username', 'user_avatar'] }, // 关联接收者信息
                  ]
                });
                // 重新加载包含关联数据的实例
                await receiveData.reload();
            }else {
                receiveData = await chatMessage.create({
                    sender_id: decodedToken.user_id,
                    group_id: data.group_id,
                    content: data.content,
                    type:data.type,
                },{
                include: [
                    { model: User, as: 'sender', attributes: ['user_id', 'username', 'user_avatar'] }, // 关联发送者信息
                    { model: ChatGroup, as: 'group', attributes: ['group_id', 'group_name', 'group_avatar', 'description'] } // 关联群聊信息
                  ]
                });
                // 重新加载包含关联数据的实例
                await receiveData.reload();
            }
            // 广播消息给所有客户端
            io.emit('receiveMessage', receiveData);
            console.log(`${new Date().toLocaleString()} 广播用户 ${decodedToken.username} receiveMessage 消息 :`, receiveData.dataValues.content);
        });

        // 监听断开连接事件
        socket.on('disconnect', () => {
            console.log(`${new Date().toLocaleString()} 用户 ${decodedToken.username} 已断开连接`);
        });
    });
    return io   
}
