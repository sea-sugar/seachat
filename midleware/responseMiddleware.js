const responseMiddleware = (req, res, next) => {
  // 封装 res.success 方法
  res.success = (code = 200, msg = 'success', data) => {
    res.status(200).json({
      code,
      msg,
      data
    });
  };

  // 封装 res.error 方法
  res.error = (code = 400, msg , data) => {
    res.status(200).json({
      code,
      msg,
      data,
    });
  };

  next();
};

module.exports = responseMiddleware;
