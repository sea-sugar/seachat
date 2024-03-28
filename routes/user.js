const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { createToken } = require('../utils/jwt');

// 注册用户
router.post('/register', async (req, res) => {
  try {
    const { user_id ,username, password ,email } = req.body;//,email ,user_avatar ,status ,created_time 
    const ok = await User.findOne({where: { user_id }})
    if (ok) {
      res.error( 200 , '重复的账号' );
      console.log("用户 id: ",user_id , " 是重复的账号，注册失败！");
      return ;
    }
    const created_time = new Date();
    await User.create({ user_id , username, password , email , created_time });
    res.success(200,'success',{username  , user_id });
    console.log("用户 id: ",user_id , " username: ",username," password: " , password ," email: " ,email ,"注册成功！");
  } catch (err) {
    console.error(err);
    res.error(500 ,'未知错误,请联系管理员重试。' );
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { user_id, password } = req.body;
    const uid = await User.findOne({where: { user_id }})
    if (!uid) {
      res.error( 200 , '错误的用户名或密码' );
      console.log("用户 id: ",user_id , " 登录失败！");
      return ;
    }
    const user = await User.findOne({ where: { user_id, password } });
    if (user) {
      const Token = createToken({username : user.username , user_id : user.user_id , user_avatar : user.user_avatar});
      res.success(200,'success',{userinfo:{username : user.username , user_id : user.user_id , user_avatar : user.user_avatar},token : Token});
      console.log("用户 id: ",user_id , " 登录成功！");
    } else {
      res.error( 200 , '错误的用户名或密码' );
      console.log("用户 id: ",user_id , " 登录失败！");
    }
  } catch (err) {
    console.error(err);
    res.error(500 , '未知错误,请联系管理员重试。');
  }
});

// 修改密码
router.post('/updatepwd', async (req, res) => {
  try {
    const { user_id, newPassword } = req.body;
    const user = await User.findOne({ where: { user_id } });
    if (user) {
      user.password = newPassword;
      await user.save();
      res.success(200, 'success',{username : user.username , user_id : user.user_id , user_avatar : user.user_avatar});
    } else {
      res.error(201, '错误的用户名' );
    }
  } catch (err) {
    console.error(err);
    res.error(500 , '未知错误,请联系管理员重试。' );
  }
});

// 验证token 返回用户信息
router.get('/getinfo', async (req, res) => {
  console.log("用户 id: ",res.userinfo.user_id , " token验证成功！");
  res.success(200,'success',{userinfo : res.userinfo})
});

// 退出登录
router.get('/logout', async (req, res) => {
  console.log("用户 id: ",res.userinfo?.user_id ?  res.userinfo.user_id : null , " 退出登录成功！");
  res.success(200,'success', res.userinfo ? null : {userinfo : res.userinfo})
});

module.exports = router;