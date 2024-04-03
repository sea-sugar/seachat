const socketIo = require('socket.io');


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
        console.log('用户已连接');

        socket.on('message', function (data) {
            console.log('服务端收到 : ', data);
            socket.send('你好客户端, ' + data);
        });
     
        //监听自定义事件
        socket.on('myevent', function (data) {
            console.log('客户端发送了一个自定义事件', data);
        });

        // 监听断开连接事件
        socket.on('disconnect', () => {
            console.log(`已断开连接`);
        });
    });
    return io   
}
