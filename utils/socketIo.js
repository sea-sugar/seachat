const socketIo = require('socket.io');
const { verifyToken }  = require('./jwt');

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
            console.log(`${new Date().toLocaleString()} 服务端收到 : `, data);
            socket.send('你好客户端, ' + data);
        });
     
        //监听自定义事件
        socket.on('myevent', function (data) {
            console.log(`${new Date().toLocaleString()} 客户端发送了一个自定义事件 `, data);
        });

        // 监听断开连接事件
        socket.on('disconnect', () => {
            console.log(`${new Date().toLocaleString()} 用户 ${decodedToken.username} 已断开连接`);
        });
    });
    return io   
}
