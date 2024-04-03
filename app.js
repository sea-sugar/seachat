const express = require('express');
const userRouter = require('./routes/user');
const sequelize = require('./utils/database');
const dotenv = require('dotenv') //环境中间件
const bodyParser = require ('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const responseMiddleware = require('./midleware/responseMiddleware');
const authMiddleware = require('./midleware/authMiddleware')
const initSocket   = require('./utils/socketIo');
const http = require('http');
// 测试数据库连接
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

dotenv.config()

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json()); //解析 application/json 
app.use(bodyParser.urlencoded({ extended: true })); //解析 application/x-www-form-urlencoded  
app.use(responseMiddleware);
app.use('/user', authMiddleware ,userRouter);

initSocket(server);


// 启动 Express 服务
server.listen(process.env.DEV_PORT, () => {
    console.log(`项目启动成功: ${process.env.DEV_URL}:${process.env.DEV_PORT}`)
})