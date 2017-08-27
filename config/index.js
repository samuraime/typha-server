const path = require('path');

module.exports = {
  env: process.env.NODE_ENV || '',
  appId: process.env.APP_ID || '',
  appSecret: process.env.APP_SECRET || '',
  db: process.env.DB || '',
  port: process.env.PORT || 3000,
  staticPath: process.env.STATIC_PATH || path.resolve(__dirname, '../public'),
  jwtSecret: process.env.JWT_SECRET || '',
};
