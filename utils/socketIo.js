const socketIo = require('socket.io');
const { verifyToken }  = require('./jwt');
const chatMessage = require('../models/chatMessage')

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
            console.log(`${new Date().toLocaleString()} 接收到用户 ${decodedToken.username} sendmessage 消息 :`, data);
            let receiveData = null ;
            if (data.receiver_id !== undefined) {
                receiveData = await chatMessage.create({
                    sender_id: decodedToken.user_id,
                    receiver_id: data.receiver_id,
                    content: data.content,
                    type:data.type,
                });
            }else {
                receiveData = await chatMessage.create({
                    sender_id: decodedToken.user_id,
                    group_id: data.group_id,
                    content: data.content,
                    type:data.type,
                });
            }
            // 广播消息给所有客户端
            io.emit('receiveMessage', receiveData);
            console.log(`${new Date().toLocaleString()} 广播用户 ${decodedToken.username} receiveMessage 消息 :`, receiveData.dataValues);
        });

        // 监听断开连接事件
        socket.on('disconnect', () => {
            console.log(`${new Date().toLocaleString()} 用户 ${decodedToken.username} 已断开连接`);
        });
    });
    return io   
}
