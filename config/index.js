const path = require('path');

module.exports = {
  env: process.env.NODE_ENV || '',
  appId: process.env.APP_ID || '', // wechat app id
  appSecret: process.env.APP_SECRET || '', // wechat app secret
  db: process.env.DB || '',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || '',
  staticPath: process.env.STATIC_PATH || path.resolve(__dirname, '../public'),
};
