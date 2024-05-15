# docker-compose build
# docker-compose up -d
# 用的宿主机的数据库
# 基础镜像为 Alpine Linux 版本 3.13， 使用 Alpine Linux 作为容器的基础操作系统
FROM alpine:3.13

# 安装依赖包，如需其他依赖包，请到alpine依赖包管理(https://pkgs.alpinelinux.org/packages?name=php8*imagick*&branch=v3.13)查找。
RUN apk add --update --no-cache nodejs npm
# 创建并设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json（如果有）到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有应用程序文件到工作目录
COPY . .

# 初始化数据库
RUN npm run init

# 暴露应用程序使用的端口
EXPOSE 3000

# 启动应用
CMD ["npm", "run", "dev"]



