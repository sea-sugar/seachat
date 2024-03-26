### sea sugar 在线聊天网站

------

建立一个基于express、mysql的在线聊天网站，要有用户信息，用户好友，聊天群聊，聊天信息，后端架构设计设计，表模型定义，数据库连接，http请求统一中间件处理。

------

###### 下载安装

```bash
## 克隆项目源码包
git clone https://github.com/gzydong/LumenIM.git

## 安装项目依赖扩展组件
npm install

# 初始化数据库
npm run init

# 启动本地开发环境
npm run dev


```



###### 一、mysql表结构设计

1. 用户信息表（users）：

   - username（用户名）

   - user_id (用户id)

   - password（密码）

   - email（邮箱）

   - user_avatar（头像URL）

   - status（在线状态）

   - created_time（创建时间）

     

2. 用户好友表（user_friends）：

   - user_id（用户ID）

   - friend_id（好友ID）

   - created_time（创建时间）

     

3. 群聊表（chat_groups）：

   - group_id（群聊id）

   - group_name（群聊名称）

   - description（群聊描述）

   - owner_id（群主ID，外键关联users表）

   - created_time（创建时间）

   - group_avatar （群聊头像）

     

4. 群聊成员表（group_members）：

   - group_id（群聊ID，外键关联chat_groups表）
   - user_id（用户ID，外键关联users表）
   - joined_time（加入时间）
   - 

5. 聊天信息表（chat_messages）：

   - sender_id（发送者ID）
   - receiver_id（接收者ID，如果是群聊则为NULL）
   - group_id（群聊ID，如果是私聊则为NULL）
   - content（消息内容）
   - type（消息类型，如文本、图片、文件等）
   - send_time（发送时间）
   - message_id （消息id）

   

   

###### 二、测试数据库连接，初始化数据库

   

```js
const sequelize = require('./utils/database');

// 测试数据库连接
async function testConnection() {
  try {
    // 尝试连接数据库
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 调用测试连接函数
testConnection();
```

###### 三、http请求统一中间件处理

```js
const responseMiddleware = (req, res, next) => {
  // 封装 res.success 方法
  res.success = (code = 200, msg = 'success', data) => {
    res.status(code).json({
      code,
      msg,
      data
    });
  };

  // 封装 res.error 方法
  res.error = (code = 400, msg) => {
    res.status(code).json({
      code,
      msg
    });
  };

  next();
};

module.exports = responseMiddleware;
```

###### 四、操作vuex

在vuex里面写登录逻辑的好处，而不是直接在页面写

1. **集中管理状态**: 将登录状态的管理放在 Vuex 的 `store` 中，可以确保在整个应用中都可以轻松地访问到登录状态。
2. **统一的状态更新**: 使用 Vuex 的 `commit` 方法提交 mutation，可以确保状态更新是同步的，并且是按照一定的规范进行的。
3. **可扩展性**: 通过 Vuex 的 `actions`，你可以很容易地扩展其他逻辑，例如处理异步操作、状态更新前的校验等。

```js
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default user

```

而不是

1. **状态分散**: 登录状态被保存在组件的状态中，而不是统一管理在 Vuex 中，这样会导致状态的分散和管理复杂度的增加。
2. **耦合性增加**: 组件直接调用登录 API，会增加组件与业务逻辑之间的耦合度，不利于代码的维护和扩展。
3. **重复代码**: 如果其他组件也需要登录功能，就需要重复编写相同的登录逻辑，不利于代码复用和统一管理。

```js
<script>
import { login } from "@/apis/user";
export default {
    name: "login",
    data() {
      return {
      };
    },
    mounted() {

    },
    methods: {
      login(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.paramsLogin.user_id = this.form.user_id ;
            this.paramsLogin.password = this.form.password ;
            login(this.paramsLogin).then(res =>{
                
                console.log(66666,res);
                if (res.code === 200 && res.msg === 'success') {
                  this.$message({
                    message: "登录成功啦",
                    type: "success",
                    showClose: true,
                  });
                  this.$router.replace("/index");
                } else {
                  this.$message({
                    message: "账户名或密码错误",
                    type: "error",
                    showClose: true,
                  });
                }
            }).catch(err =>{
                console.log(err);
                // this.$message({
                //   message: `${err}`,
                //   type: "error",
                //   showClose: true,
                // });
            })
          } else {
            return false;
          }
        });
      },
      
    },
  };
</script>
```



###### 五、登录的token验证以及无感刷新token

